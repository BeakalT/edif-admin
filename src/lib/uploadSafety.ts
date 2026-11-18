import sharp from 'sharp'
import net from 'net'
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFStream } from 'pdf-lib'
import { APIError } from 'payload'

const sig = (b: Buffer) => {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  if (b.length > 12 && b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  if (b.length > 12 && b.subarray(4, 8).toString() === 'ftyp' && /avif|avis/.test(b.subarray(8, 12).toString())) return 'image/avif'
  if (b.length > 5 && b.subarray(0, 5).toString() === '%PDF-') return 'application/pdf'
  return ''
}

/** Optional virus scan through a ClamAV daemon (set CLAMAV_HOST and CLAMAV_PORT). If it is configured but unreachable, the upload is refused. */
async function clamScan(buf: Buffer) {
  const host = process.env.CLAMAV_HOST
  if (!host) return
  const port = Number(process.env.CLAMAV_PORT || 3310)
  const reply = await new Promise<string>((resolve, reject) => {
    const s = net.connect({ host, port }, () => {
      s.write('zINSTREAM\0')
      for (let i = 0; i < buf.length; i += 65536) {
        const c = buf.subarray(i, i + 65536)
        const len = Buffer.alloc(4); len.writeUInt32BE(c.length); s.write(len); s.write(c)
      }
      s.write(Buffer.alloc(4))
    })
    let out = ''
    s.on('data', (d) => (out += d)); s.on('end', () => resolve(out)); s.on('error', reject)
    s.setTimeout(30000, () => { s.destroy(); reject(new Error('timeout')) })
  }).catch(() => { throw new APIError('The virus scanner is not reachable, so this file cannot be accepted right now. Please try again later or contact an administrator.', 503) })
  if (!/OK\s*$/.test(reply.replace(/\0/g, ''))) throw new APIError('This file was rejected by the virus scanner.', 400)
}

/** Size limits per kind. The server also refuses any upload over MAX_UPLOAD_BYTES before it is read. */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

// PDF features that can run code or carry other files. A public document of the Fund needs none of them.
const BAD_ACTIONS = new Set(['/JavaScript', '/Launch', '/ImportData', '/SubmitForm', '/GoToE', '/Rendition', '/RichMediaExecute'])
const BAD_KEYS = ['JS', 'JavaScript', 'EmbeddedFiles', 'EmbeddedFile', 'XFA', 'RichMedia'].map((k) => PDFName.of(k))
const S = PDFName.of('S'), TYPE = PDFName.of('Type')

/** Returns the name of the first active feature found in the PDF, or '' if there is none. Checks every object, including compressed ones. */
export function pdfActiveContent(pdf: PDFDocument): string {
  const seen = new Set<unknown>()
  const walk = (o: unknown, depth: number): string => {
    if (!o || depth > 64 || seen.has(o)) return ''
    seen.add(o)
    if (o instanceof PDFStream) return walk(o.dict, depth + 1)
    if (o instanceof PDFDict) {
      for (const k of BAD_KEYS) if (o.has(k)) return k.asString()
      const s = o.get(S), t = o.get(TYPE)
      if (s instanceof PDFName && BAD_ACTIONS.has(s.asString())) return s.asString()
      if (t instanceof PDFName && t.asString() === '/EmbeddedFile') return '/EmbeddedFile'
      for (const [, v] of o.entries()) { const r = walk(v, depth + 1); if (r) return r }
    } else if (o instanceof PDFArray) {
      for (const v of o.asArray()) { const r = walk(v, depth + 1); if (r) return r }
    }
    return ''
  }
  for (const [, obj] of pdf.context.enumerateIndirectObjects()) { const r = walk(obj, 0); if (r) return r }
  return ''
}

/** Check the file really is what it says, remove hidden metadata (GPS position, camera, author, software), and optionally virus-scan it. */
export async function sanitizeUpload(file: { data: Buffer; mimetype: string; size: number; name: string }) {
  const kind = sig(file.data)
  if (!kind || kind !== file.mimetype) throw new APIError('The file content does not match its type. Only genuine JPEG, PNG, WebP, AVIF and PDF files are accepted.', 400)
  const limit = kind === 'application/pdf' ? MAX_UPLOAD_BYTES : MAX_IMAGE_BYTES
  if (file.data.length > limit) throw new APIError(`This file is too large. The limit is ${limit / 1024 / 1024} MB for ${kind === 'application/pdf' ? 'PDFs' : 'images'}.`, 413)
  await clamScan(file.data)
  if (kind === 'application/pdf') {
    let pdf: PDFDocument
    try {
      pdf = await PDFDocument.load(file.data, { updateMetadata: false, ignoreEncryption: false })
    } catch {
      throw new APIError('This PDF could not be read. It may be damaged or password protected.', 400)
    }
    const active = pdfActiveContent(pdf)
    if (active) throw new APIError(`This PDF contains active content (${active.slice(1)}) such as scripts, launch actions or attached files, which is not allowed on the website. Save or print it to a new PDF and upload that instead.`, 400)
    try {
      pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]); pdf.setProducer('EDIF'); pdf.setCreator('EDIF')
      pdf.catalog.delete(PDFName.of('Metadata')) // XMP packet
      const out = Buffer.from(await pdf.save())
      file.data = out; file.size = out.length
    } catch {
      throw new APIError('This PDF could not be read. It may be damaged or password protected.', 400)
    }
  } else {
    // rotate() applies the camera orientation first; sharp then writes the image without EXIF/XMP/ICC extras
    const img = sharp(file.data, { failOn: 'error' }).rotate()
    const out = await (kind === 'image/jpeg' ? img.jpeg({ quality: 92, mozjpeg: true }) : kind === 'image/png' ? img.png() : kind === 'image/webp' ? img.webp({ quality: 92 }) : img.avif()).toBuffer().catch(() => { throw new APIError('This image could not be read.', 400) })
    file.data = out; file.size = out.length
  }
}

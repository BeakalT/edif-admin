import sharp from 'sharp'
import { PDFDocument, PDFName, PDFString } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import { sanitizeUpload } from '@/lib/uploadSafety'

const file = (data: Buffer, mimetype: string, name = 'f') => ({ data, mimetype, size: data.length, name })

describe('upload safety', () => {
  it('rejects a file whose content is not what its type claims', async () => {
    await expect(sanitizeUpload(file(Buffer.from('<?php echo 1; ?>'), 'image/jpeg'))).rejects.toThrow(/does not match/)
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#fff' } }).png().toBuffer()
    await expect(sanitizeUpload(file(png, 'application/pdf'))).rejects.toThrow(/does not match/)
  })
  it('removes GPS and camera metadata from photos', async () => {
    const jpg = await sharp({ create: { width: 32, height: 32, channels: 3, background: '#888' } }).jpeg().withExif({ IFD0: { Make: 'SpyCam', Software: 'Tracker' } }).toBuffer()
    expect((await sharp(jpg).metadata()).exif).toBeTruthy()
    const f = file(jpg, 'image/jpeg'); await sanitizeUpload(f)
    const after = await sharp(f.data).metadata()
    expect(after.exif).toBeUndefined()
    expect(f.data.toString('latin1')).not.toContain('SpyCam')
  })
  it('removes author and title from PDFs', async () => {
    const pdf = await PDFDocument.create(); pdf.addPage(); pdf.setAuthor('Secret Author'); pdf.setTitle('Secret Title')
    const f = file(Buffer.from(await pdf.save()), 'application/pdf'); await sanitizeUpload(f)
    const out = await PDFDocument.load(f.data)
    expect(out.getAuthor() || '').toBe('')
    expect(out.getTitle() || '').toBe('')
    expect(f.data.toString('latin1')).not.toContain('Secret Author')
  })
  it('rejects a damaged PDF', async () => {
    await expect(sanitizeUpload(file(Buffer.from('%PDF-1.4\ngarbage'), 'application/pdf'))).rejects.toThrow()
  })
  it('refuses PDFs that can run scripts, launch programs or carry attached files', async () => {
    const build = async (fn: (d: PDFDocument) => void) => { const d = await PDFDocument.create(); d.addPage(); fn(d); return Buffer.from(await d.save()) }
    const js = await build((d) => d.catalog.set(PDFName.of('OpenAction'), d.context.obj({ S: 'JavaScript', JS: PDFString.of('app.alert(1)') })))
    const launch = await build((d) => d.getPage(0).node.set(PDFName.of('AA'), d.context.obj({ O: d.context.obj({ S: 'Launch', F: PDFString.of('cmd.exe') }) })))
    const attached = await build((d) => { void d.attach(Buffer.from('x'), 'a.txt', { mimeType: 'text/plain' }) })
    for (const b of [js, launch, attached]) await expect(sanitizeUpload(file(b, 'application/pdf'))).rejects.toThrow(/active content/)
  })
  it('keeps ordinary PDFs that open at a page (GoTo action)', async () => {
    const d = await PDFDocument.create(); d.addPage(); d.catalog.set(PDFName.of('OpenAction'), d.context.obj([d.getPage(0).ref, PDFName.of('Fit')]))
    await expect(sanitizeUpload(file(Buffer.from(await d.save()), 'application/pdf'))).resolves.toBeUndefined()
  })
  it('refuses files over the size limit before processing them', async () => {
    const big = Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.alloc(21 * 1024 * 1024)])
    await expect(sanitizeUpload(file(big, 'application/pdf'))).rejects.toThrow(/too large/)
  })
})

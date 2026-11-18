import sharp from 'sharp'
import { PDFDocument } from 'pdf-lib'
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
})

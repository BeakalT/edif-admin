// Adds photos to people already in the admin. Put the image files in one folder, named after the person, e.g.
//   solomon-desta.jpg  frezer-ayalew.jpg  sintayehu-desalegn.jpg  desalegn-ambaw.png
// then run:   npx payload run scripts/attach-photos.ts path/to/folder
// Matching ignores titles (Ato, Dr). Each photo becomes a Media item with the person's name as its description and is linked to that person.
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dir = process.argv.find((a) => fs.existsSync(a) && fs.statSync(a).isDirectory() && !a.includes('node_modules') && path.resolve(a) !== process.cwd())
if (!dir) { console.error('Give the folder with the photos, e.g. npx payload run scripts/attach-photos.ts ~/Desktop/board-photos'); process.exit(1) }
const slug = (s: string) => s.toLowerCase().replace(/\b(ato|dr|ph\.?d\.?|w\/ro|prof)\b\.?/g, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const payload = await getPayload({ config })
const sys = { overrideAccess: true as const, context: { seeding: true } }
const people = (await payload.find({ collection: 'people', limit: 500, depth: 0, draft: false, ...sys })).docs as any[]
let done = 0
for (const f of fs.readdirSync(dir).filter((n) => /\.(jpe?g|png|webp)$/i.test(n))) {
  const key = slug(path.parse(f).name)
  const p = people.find((x) => slug(x.name) === key) || people.find((x) => slug(x.name).includes(key) || key.includes(slug(x.name)))
  if (!p) { console.log(`skip  ${f}: no person called "${key.replace(/-/g, ' ')}"`); continue }
  const buf = fs.readFileSync(path.join(dir, f))
  const ext = path.extname(f).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const m: any = await payload.create({ collection: 'media', data: { alt: p.name }, file: { data: buf, mimetype: mime, name: `${slug(p.name)}${ext}`, size: buf.length }, ...sys })
  await payload.update({ collection: 'people', id: p.id, draft: false, data: { photo: m.id }, ...sys })
  console.log(`ok    ${f} -> ${p.name}`)
  done++
}
console.log(`${done} photo(s) added. Reload the Governance page.`)
process.exit(0)

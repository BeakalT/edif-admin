/* Builds static pages of the real dashboard (every role, both themes) plus a small harness for its interactive parts,
   so design checks run in a browser without a database or server. Output: .dashboard-preview/ */
import fs from 'fs'
import path from 'path'
import { build } from 'esbuild'
import * as sass from 'sass'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { renderDashboard, ROLES } from '../tests/fixtures/dashboard'

const out = path.resolve('.dashboard-preview')
fs.mkdirSync(out, { recursive: true })
const fonts = `file://${path.resolve('public/fonts')}/`
const css = sass.compile('src/app/(payload)/custom.scss', { style: 'expanded', loadPaths: ['node_modules'], logger: sass.Logger.silent }).css.replaceAll("url('/fonts/", `url('${fonts}`)
fs.writeFileSync(path.join(out, 'c.css'), css)


const vars = (t: string) => (t === 'dark'
  ? '--theme-text:#e9edf6;--theme-elevation-100:#172447;--theme-elevation-150:#1d2c52;'
  : '--theme-text:#1a2748;--theme-elevation-100:#e9edf6;--theme-elevation-150:#dde3f0;')
const page = (theme: string, body: string, script = '') =>
  `<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dashboard preview</title><link rel="stylesheet" href="c.css"><link rel="stylesheet" href="dash.css"><style>html{${vars(theme)}}body{margin:0;background:var(--theme-bg);color:var(--theme-text);font-family:var(--edif-body);padding:24px clamp(16px,4vw,48px)}a{color:inherit}</style></head><body><main id="root">${body}</main>${script}</body></html>`

;(async () => {
  // dash.css uses Tailwind syntax, so it is compiled here the same way Next does; components no longer import it directly.
  const dashSrc = path.resolve('src/components/admin/dash.css')
  const dashCss = (await postcss([tailwind()]).process(fs.readFileSync(dashSrc, 'utf8'), { from: dashSrc })).css
  fs.writeFileSync(path.join(out, 'dash.css'), dashCss)
  for (const role of ROLES) {
    const html = await renderDashboard(role)
    for (const theme of ['light', 'dark']) fs.writeFileSync(path.join(out, `${role}-${theme}.html`), page(theme, html ?? ''))
  }
  await build({ entryPoints: ['tests/fixtures/harness.tsx'], bundle: true, format: 'iife', outfile: path.join(out, 'harness.js'), jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'error' })
  for (const theme of ['light', 'dark']) fs.writeFileSync(path.join(out, `harness-${theme}.html`), page(theme, '', '<script src="harness.js"></script>'))
  console.log(`dashboard preview written to ${out}`)
})()

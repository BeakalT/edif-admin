// Tailwind only processes stylesheets that opt in (src/components/admin/dash.css). Plain CSS passes through untouched.
const config = { plugins: { '@tailwindcss/postcss': {} } }
export default config

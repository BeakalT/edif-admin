/**
 * JSON for a <script type="application/ld+json"> block. JSON.stringify leaves `<` as is, so a value
 * containing `</script>` would close the tag and turn the rest into HTML. Escaping these characters
 * keeps the JSON identical for search engines and makes it inert as markup.
 */
export const jsonLd = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

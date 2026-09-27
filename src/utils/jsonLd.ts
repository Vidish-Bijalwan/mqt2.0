/**
 * Serialize a JSON-LD object for use in dangerouslySetInnerHTML.
 * Escapes `<` so a literal `</script>` can never break out of the script tag.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Facet values are kebab-case ids ("screen-reader", "e2e"); this turns one into a label
// ("Screen reader", "E2E") for chips, headings and the card's facet line.
const ACRONYMS = new Set(["api", "ui", "ci", "e2e", "lcp", "inp", "cls", "fcp", "ttfb", "wcag", "owasp", "a", "aa", "aaa"]);

export function valueLabel(value: string): string {
  const words = value.split("-").map((word) => (ACRONYMS.has(word) || /\d/.test(word) ? word.toUpperCase() : word));
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

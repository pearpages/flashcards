export interface TextPart {
  text: string;
  code: boolean;
}

/** Splits card text on backticks: "`dialog` element" → code "dialog", text " element". */
export function splitInlineCode(text: string): TextPart[] {
  const pieces = text.split("`");
  // An odd number of backticks leaves the last one unpaired: keep it as text.
  if (pieces.length % 2 === 0) return [{ text, code: false }];
  return pieces
    .map((piece, i) => ({ text: piece, code: i % 2 === 1 }))
    .filter((part) => part.text !== "");
}

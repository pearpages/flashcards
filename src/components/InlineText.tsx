import { splitInlineCode } from "../inlineCode";

/** Card text with `backticked` runs shown as code. Rendered as React text, never as HTML. */
export default function InlineText({ text }: { text: string }) {
  return (
    <>
      {splitInlineCode(text).map((part, i) =>
        part.code ? (
          <code key={i} className="inline-code">
            {part.text}
          </code>
        ) : (
          part.text
        ),
      )}
    </>
  );
}

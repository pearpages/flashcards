import { describe, expect, it } from "vitest";
import { splitInlineCode } from "./inlineCode";

describe("splitInlineCode", () => {
  it("returns plain text as one part", () => {
    expect(splitInlineCode("no code here")).toEqual([{ text: "no code here", code: false }]);
  });

  it("marks backticked runs as code", () => {
    expect(splitInlineCode("Use `<dialog>` with `showModal()`.")).toEqual([
      { text: "Use ", code: false },
      { text: "<dialog>", code: true },
      { text: " with ", code: false },
      { text: "showModal()", code: true },
      { text: ".", code: false },
    ]);
  });

  it("leaves an unpaired backtick alone", () => {
    expect(splitInlineCode("a ` b")).toEqual([{ text: "a ` b", code: false }]);
  });
});

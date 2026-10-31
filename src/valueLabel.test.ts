import { describe, expect, it } from "vitest";
import { valueLabel } from "./valueLabel";

describe("valueLabel", () => {
  it("turns a kebab-case value into a sentence-case label", () => {
    expect(valueLabel("screen-reader")).toBe("Screen reader");
    expect(valueLabel("pattern")).toBe("Pattern");
  });

  it("keeps acronyms and codes in capitals", () => {
    expect(valueLabel("e2e")).toBe("E2E");
    expect(valueLabel("api")).toBe("API");
    expect(valueLabel("wcag-aa")).toBe("WCAG AA");
    expect(valueLabel("a01-access-control")).toBe("A01 access control");
  });
});

import { describe, expect, it } from "vitest";
import { loadHidden, saveHidden, type HiddenStorage } from "./hiddenCards";

function memoryStorage(initial: Record<string, string> = {}): HiddenStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

const throwing: HiddenStorage = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

const ids = ["a", "b", "c"];

describe("hidden cards", () => {
  it("saves and loads the hidden ids per deck", () => {
    const storage = memoryStorage();
    saveHidden("css", new Set(["a", "c"]), storage);
    expect(loadHidden("css", ids, storage)).toEqual(new Set(["a", "c"]));
    expect(loadHidden("testing", ids, storage)).toEqual(new Set());
  });

  it("removes the entry when nothing is hidden", () => {
    const storage = memoryStorage();
    saveHidden("css", new Set(["a"]), storage);
    saveHidden("css", new Set(), storage);
    expect(storage.data).toEqual({});
  });

  it("ignores corrupt or unexpected data", () => {
    expect(loadHidden("css", ids, memoryStorage({ "flashcards:hidden:css": "{not json" }))).toEqual(new Set());
    expect(loadHidden("css", ids, memoryStorage({ "flashcards:hidden:css": '{"a":1}' }))).toEqual(new Set());
    expect(loadHidden("css", ids, memoryStorage({ "flashcards:hidden:css": '["a",2,null,"zzz"]' }))).toEqual(
      new Set(["a"]),
    );
  });

  it("treats unavailable storage as nothing hidden", () => {
    expect(loadHidden("css", ids, throwing)).toEqual(new Set());
    expect(loadHidden("css", ids, undefined)).toEqual(new Set());
    expect(() => saveHidden("css", new Set(["a"]), throwing)).not.toThrow();
  });
});

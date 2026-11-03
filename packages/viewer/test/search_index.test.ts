// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { describe, expect, it } from "vitest";
import { SearchIndex } from "../src/search/search_index.js";

function search(texts: string[], query: string): string[] {
  const index = new SearchIndex();
  index.addPoints(texts.map((text, id) => ({ id, text })));
  return index.query(query, 100).map((id) => texts[id as number]);
}

describe("SearchIndex", () => {
  it("does not match words that only sound alike", () => {
    expect(search(["bed", "bet"], "bed")).toEqual(["bed"]);
    expect(search(["ship", "sheep"], "ship")).toEqual(["ship"]);
    expect(search(["bat", "bad"], "bat")).toEqual(["bat"]);
    expect(search(["color", "colour"], "color")).toEqual(["color"]);
  });

  it("matches case-insensitively", () => {
    expect(search(["The quick brown fox"], "QUICK")).toEqual(["The quick brown fox"]);
  });

  it("folds diacritics", () => {
    expect(search(["café latte", "Ölmühle"], "cafe")).toEqual(["café latte"]);
    expect(search(["café latte", "Ölmühle"], "olmuhle")).toEqual(["Ölmühle"]);
  });

  it("matches word prefixes", () => {
    expect(search(["category", "dog"], "cat")).toEqual(["category"]);
  });

  it("returns nothing after clear", () => {
    const index = new SearchIndex();
    index.addPoints([{ id: 1, text: "hello world" }]);
    index.clear();
    expect(index.query("hello", 10)).toEqual([]);
  });
});

// Copyright (c) 2025 Apple Inc. Licensed under MIT License.

import { Charset, Index, type IndexOptions } from "flexsearch";

// LatinDefault folds case and diacritics without phonetic matching.
// Phonetic encoders such as LatinBalance treat words that sound alike
// ("bed" and "bet", "ship" and "sheep") as equal, which produces false
// matches in full-text search.
export const searchIndexOptions: IndexOptions = {
  tokenize: "forward",
  encoder: Charset.LatinDefault,
};

export class SearchIndex {
  private index: Index;

  constructor() {
    this.index = new Index(searchIndexOptions);
  }

  clear() {
    this.index.clear();
    this.index.cleanup();
    this.index = new Index(searchIndexOptions);
  }

  addPoints(points: { id: string | number; text: string }[]) {
    for (let p of points) {
      this.index.add(p.id, p.text);
    }
  }

  query(query: string, limit: number): (string | number)[] {
    return this.index.search(query, { limit });
  }
}

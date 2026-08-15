import type { CollectionEntry } from "astro:content";
import { secretFilter } from "./secretFilter";

/**
 * Returns secrets that are eligible to be shown to users, sorted by “last updated”
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 *
 * Note: filtering respects drafts and scheduled secrets via `secretFilter()`.
 */
export function getSortedSecrets(posts: CollectionEntry<"posts">[]) {
  return posts
    .filter(secretFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
}

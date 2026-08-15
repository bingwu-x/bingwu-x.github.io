import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - Excludes drafts always
 * - In production, excludes scheduled posts until `pubDatetime` minus the configured margin
 * - In dev, always shows non-draft posts to make authoring easier
 */
export function postFilterUnprotected({ data }: CollectionEntry<"posts">) {
  const isProtected = !!(data.password || data.payload);
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed) && !isProtected;
}

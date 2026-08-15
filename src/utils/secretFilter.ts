import type { CollectionEntry } from "astro:content";
import config from "@/config";

export function secretFilter({ data }: CollectionEntry<"posts">) {
  const isProtected = !!(data.password || data.payload);
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed) && isProtected;
}

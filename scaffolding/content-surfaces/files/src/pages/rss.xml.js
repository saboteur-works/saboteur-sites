// /rss.xml — the blog feed.
//
// Static endpoint, no client JS, no third party. The feed carries each post's
// description, not its full body: full-text RSS would need a markdown renderer
// plus HTML sanitising, and the description is already written as the post's
// opening line. Someone who wants the post opens the post.
//
// The changelog has no feed — it is one page, so a reader watching it for
// changes is watching a single URL.
//
// Requires: npm i @astrojs/rss
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  // Same draft filter as every other surface. A draft in the feed is published,
  // and a feed item cannot be unpublished once a reader has fetched it.
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    // TODO: site name as a person says it, e.g. "OffBeat-FM".
    title: "TODO — Blog",
    // TODO: same sentence as the /blog meta description.
    description: "TODO",
    // The production origin from astro.config.mjs, so a preview deploy never
    // emits a feed pointing at pages.dev.
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
    // Feed readers style raw XML badly without it; this file is served from
    // public/ and is plain CSS.
    stylesheet: "/rss/styles.xsl",
  });
}

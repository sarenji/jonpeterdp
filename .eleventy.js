const markdownIt = require("markdown-it");
const order = require("./_data/order.json");
const orderedIds = new Set(Object.values(order).flat());

function orderCollection(collection, uuids) {
  const positions = new Map(uuids.map((uuid, index) => [uuid, index]));
  return [...collection].sort((a, b) => {
    const aPosition = positions.get(a.data.uuid);
    const bPosition = positions.get(b.data.uuid);
    if (aPosition !== undefined && bPosition !== undefined) return aPosition - bPosition;
    if (aPosition !== undefined) return -1;
    if (bPosition !== undefined) return 1;
    return 0;
  });
}

module.exports = function(eleventyConfig) {
  // Copy the `img` and `css` folders to the output
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");

  // Netlify CMS
  eleventyConfig.addPassthroughCopy("admin");

  // Provide our own version of markdown-it to add breaks on newlines
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }));

  // Collections
  eleventyConfig.addCollection("published", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md")
      .filter((post) => orderedIds.has(post.data.uuid));
  });
  eleventyConfig.addCollection("categories", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("posts/*.md")
      .filter((post) => orderedIds.has(post.data.uuid))
    const categories = [...new Set(posts.map((post) => post.data.category))]
      .filter(Boolean)
    if (order.featuredPosts.length) {
      categories.push("featured");
    }
    return categories.sort();
  });
  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md")
      .filter((post) => order.featuredPosts.includes(post.data.uuid));
  });

  // Filters
  eleventyConfig.addFilter("titleify", function(value) {
    return value
      .split(/[-_\s]/)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  });
  eleventyConfig.addFilter("postsForCategory", function(collection, category) {
    return collection.filter((post) => {
      return post.data.category === category;
    }).sort((a, b) => {
      const aOrder = a.data.order ?? 0;
      const bOrder = b.data.order ?? 0;
      return bOrder - aOrder || new Date(b.data.date) - new Date(a.data.date);
    });
  });
  eleventyConfig.addFilter("orderedBy", function(collection, uuids) {
    return orderCollection(collection, uuids);
  });
  eleventyConfig.addFilter("orderedByCategory", function(collection, ordering, category) {
    const key = {
      commercial: "commercialPosts",
      "long-form": "longFormPosts",
      "music-video": "musicVideoPosts",
    }[category];
    return key ? orderCollection(collection, order[key]) : collection;
  });
};

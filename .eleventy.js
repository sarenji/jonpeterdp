const markdownIt = require("markdown-it");

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
  eleventyConfig.addCollection("featured", function(collectionApi) {
    return collectionApi.getFilteredByTag("featured");
  });
  eleventyConfig.addCollection("commercial", function(collectionApi) {
    return collectionApi.getFilteredByTag("commercial");
  });
  eleventyConfig.addCollection("narrative", function(collectionApi) {
    return collectionApi.getFilteredByTag("narrative");
  });
  eleventyConfig.addCollection("music-video", function(collectionApi) {
    return collectionApi.getFilteredByTag("music-video");
  });

  // Filters
  eleventyConfig.addFilter("titleify", function(value) {
    return value
      .split(/[-_\s]/)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  });
  eleventyConfig.addFilter("postsForTag", function(collection, tag) {
    return collection.filter((post) => {
      return post.data.tag === tag;
    }).sort((a, b) => {
      const aOrder = a.data.order ?? 0;
      const bOrder = b.data.order ?? 0;
      if (aOrder < bOrder) {
        return -1;
      } else if (aOrder < bOrder) {
        return -1;
      }

      const aDate = a.data.date;
      const bDate = b.data.date;
      if (aDate < bDate) {
        return -1;
      } else if (aDate < bDate) {
        return 1;
      }
      return 0;
    });
  });
  eleventyConfig.addFilter("pick", function(collection, uuids) {
    return uuids.map((uuid) => {
      return collection.find((post) => post.data.uuid === uuid);
    }).filter(Boolean);
  });
  eleventyConfig.addFilter("uuidsForTag", function(data, tag) {
    switch (tag) {
      case "featured": return data.featuredPosts;
      case "commercial": return data.commercialPosts;
      case "music-video": return data.musicVideoPosts;
      case "narrative": return data.narrativePosts;
      default: throw new Error(`Could not recognize tag: ${tag}`);
    }
  });
};
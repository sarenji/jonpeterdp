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
    });
  });
};
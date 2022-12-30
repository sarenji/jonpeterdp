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
};
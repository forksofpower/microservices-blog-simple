const libs = ["posts", "comments", "event-bus", "moderation", "query"];

module.exports = {
  apps: libs.map((lib) => ({
    name: lib,
    script: `./${lib}/index.js`,
    watch: true,
  })),
};

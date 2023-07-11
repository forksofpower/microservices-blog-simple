const packages = ["posts", "comments", "event-bus", "moderation", "query"];

module.exports = {
  apps: packages.map((package) => ({
    name: package,
    script: `./packages/${package}/index.js`,
    watch: true,
  })),
};

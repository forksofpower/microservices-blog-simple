const libs = [
  "posts",
  // 'client',
  "comments",
  "event-bus",
  "moderation",
  "query",
];

module.exports = {
  apps: libs.map((lib) => ({
    name: lib,
    script: `./${lib}/index.js`,
    watch: true,
  })),
};

// module.exports = {
//   apps: [
//     {
//       name: "posts",
//       script: "./posts/index.js",
//     },
//   ],
// };

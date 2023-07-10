const express = require("express");
const cors = require("cors");
const Services = require("../common/services");

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Query Service
 *
 * Subscribes To:
 * - PostCreated
 * - PostDeleted
 * - CommentCreated
 * - CommentDeleted
 */

/**
 * @type {Object.<string, Post>}
 */
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // console.info(`Recieved Event: ${type}\n`, data);
  switch (type) {
    case "CommentCreated":
      handleCommentCreated(data);
      break;
    case "CommentUpdated":
      handleCommentUpdated(data);
      break;
    case "CommentDeleted":
      handleCommentDeleted(data);
      break;
    case "PostCreated":
      handlePostCreated(data);
      break;
    case "PostDeleted":
      handlePostDeleted(data);
      break;
    default:
    // console.warn(`Ignored Event: ${type}`);
  }
  res.send({ status: "OK" });
});

app.listen(Services.Query, () => {
  console.info(`listening on port ${Services.Query}`);
});

// Event Handlers

/**
 * @param {Post} post
 */
function handlePostCreated(post) {
  if (!posts.hasOwnProperty(post.id)) {
    posts[post.id] = post;
    console.debug(`Post Created <${post.id}>`);
  }
}

/**
 * @param {Post} post
 */
function handlePostDeleted(post) {
  const success = delete posts[post.id];
  if (success) console.debug(`Post Deleted <${post.id}>`);
}

/**
 * @param {Comment} comment
 */
function handleCommentCreated(comment) {
  /** @type Post*/
  const post = posts[comment.postId];

  if (post) {
    if (!post.comments) post.comments = [];
    post.comments.push({
      id: comment.id,
      content: comment.content,
      status: comment.status,
    });
    posts[comment.postId] = post;
    console.debug(`Comment Created <${comment.id}> for Post <${post.id}>`);
  }
}

/**
 * @param {Comment} comment
 **/
async function handleCommentUpdated(comment) {
  /** @type Post */
  const post = posts[comment.postId];
  const commentIndex = post.comments.findIndex((x) => x.id === comment.id);
  post.comments[commentIndex] = comment;

  posts[comment.postId] = post;

  console.debug(`Comment Updated <${comment.id}> for Post <${post.id}>`);
}

/**
 * @param {Comment} comment
 */
function handleCommentDeleted(comment) {
  const { postId, id: commentId } = comment;
  const post = posts[postId];

  if (post && post.comments) {
    post.comments = post.comments.filter((c) => c.id !== commentId);
    posts[postId] = post;
    console.debug(`Comment Deleted <${comment.id}> for Post <${post.id}>`);
  }
}

/**
 * @typedef Comment
 * @type {object}
 * @property {string} id - the comment id
 * @property {string} content - the comment content
 * @property {string} [postId] - the comment post id
 * @property {string} status
 *
 * @typedef Post
 * @type {object}
 * @property {string} id - the post id
 * @property {string} title - the post title
 * @property {Comment[]} [comments] - the array of post comments
 */

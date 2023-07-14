const express = require("express");
const cors = require("cors");
// const Services = require("../common/services");
const {
  Services,
  servs: { services },
} = require("@microservice-blog/common");
const axios = require("axios");
const axiosRetry = require("axios-retry");

const app = express();
app.use(express.json());
app.use(cors());

/**
 * @type {Object.<string, Post>}
 */
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({ status: "OK" });
});

app.listen(Services.Query, async () => {
  console.info(`listening on port ${Services.Query}`);
  console.log(services.EventBus.url);
  try {
    console.log("Event Sync Started");
    const res = await axios.get(`${services.EventBus.url}/events`, {
      axiosRetry: { retries: 3 },
    });
    for (let { type, data } of res.data) {
      handleEvent(type, data);
    }
    // console.log(JSON.stringify(posts, null, 2));
    console.log(`Event Sync Complete`);
  } catch (error) {
    console.error("Error syncing events from event-bus service");
    throw new Error(error);
  }
});

// Event Handlers
function handleEvent(type, data) {
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
}

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

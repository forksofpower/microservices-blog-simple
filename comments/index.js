const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// Common
const Services = require("../common/services");

/**
 * Comments Service
 *
 * Subscribes To:
 * - PostDeleted
 * Publishes:
 * - CommentCreated
 * - CommentUpdated
 * - CommentDeleted
 */
const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.get("/comments", (req, res) => {
  res.send(commentsByPostId);
});

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;

  const commentId = randomBytes(4).toString("hex");
  const comment = { id: commentId, postId, content, status: "pending" };
  const comments = commentsByPostId[postId] || [];

  comments.push(comment);

  commentsByPostId[postId] = comments;

  console.debug(`Comment Created <${comment.id}> for Post <${postId}>`);
  await emitEvent("CommentCreated", comment);

  res.status(201).send(comment);
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const { postId, commentId } = req.params;
  let comments = commentsByPostId[postId];

  if (comments) {
    comments = comments.filter((c) => c.id !== commentId);
    commentsByPostId[postId] = comments;
  } else {
    res.status(404).send({ error: "Comment or Post not found" });
  }

  console.debug(`Comment Deleted <${comment.id}> for Post <${post.id}>`);
  await emitEvent("CommentDeleted", { id: commentId, postId });
  res.status(204).end();
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // console.info(`Recieved Event: ${type}\n`, data);
  switch (type) {
    case "PostDeleted":
      handlePostDeleted(data);
      break;
    case "CommentModerated":
      handleCommentModerated(data);
      break;
    default:
    // console.warn(`Ignored Event: ${type}`);
  }
  res.send({ status: "OK" });
});

app.listen(Services.Comments, () => {
  console.info(`Listening on port ${Services.Comments}`);
});

function emitEvent(type, data) {
  console.debug(`Emitting Event: `, type);
  return axios.post(`http://localhost:${Services.EventBus}/events`, {
    type,
    data,
  });
}

function handlePostDeleted(data) {
  delete commentsByPostId[data.id];
}
/**
 * @param {Comment} commentEvent
 **/
async function handleCommentModerated(commentEvent) {
  const comments = commentsByPostId[commentEvent.postId];
  const commentIndex = comments.findIndex((x) => x.id === commentEvent.id);
  comments[commentIndex].status = commentEvent.status;

  commentsByPostId[commentEvent.postId] = comments;

  await emitEvent("CommentUpdated", comments[commentIndex]);
}

/**
 * @typedef Comment
 * @type {object}
 * @property {string} id - the comment id
 * @property {string} content - the comment content
 * @property {string} [postId] - the comment post id
 * @property {string} status - the moderation status
 *
 * @typedef Post
 * @type {object}
 * @property {string} id - the post id
 * @property {string} title - the post title
 * @property {Comment[]} [comments] - the array of post comments
 */

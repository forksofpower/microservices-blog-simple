const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

// Common
const { config } = require("@microservice-blog/common");

const app = express();
app.use(express.json());
app.use(cors());

const commentsByPostId = {};

app.post("/posts/:id/comments/create", async (req, res) => {
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

app.delete("/posts/:postId/comments/:commentId/delete", async (req, res) => {
  const { postId, commentId } = req.params;
  let comments = commentsByPostId[postId];

  if (comments) {
    comments = comments.filter((c) => c.id !== commentId);
    commentsByPostId[postId] = comments;
  } else {
    res.status(404).send({ error: "Comment or Post not found" });
  }

  console.debug(`Comment Deleted <${commentId}> for Post <${postId}>`);
  await emitEvent("CommentDeleted", { id: commentId, postId });
  res.status(204).end();
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case "PostDeleted":
      handlePostDeleted(data);
      break;
    case "CommentModerated":
      handleCommentModerated(data);
      break;
    default:
  }
  res.send({ status: "OK" });
});

app.listen(config.services.Comments.port, () => {
  console.info(`Listening on port ${config.}`);
});

function emitEvent(type, data) {
  console.debug(`Emitting Event: `, type);
  return axios.post(`${config.services.EventBus.url}/events`, {
    type,
    data,
  });
}

function handlePostDeleted(data) {
  delete commentsByPostId[data.id];
}

async function handleCommentModerated(commentEvent) {
  const comments = commentsByPostId[commentEvent.postId];
  const commentIndex = comments.findIndex((x) => x.id === commentEvent.id);
  comments[commentIndex].status = commentEvent.status;

  commentsByPostId[commentEvent.postId] = comments;

  await emitEvent("CommentUpdated", comments[commentIndex]);
}

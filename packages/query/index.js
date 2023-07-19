const express = require("express");
const cors = require("cors");
const { config } = require("@microservice-blog/common");
const axios = require("axios");
const axiosRetry = require("axios-retry");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({ status: "OK" });
});

app.listen(config.services.Query.port, async () => {
  console.info(`listening on port ${config.services.Query.port}`);
  try {
    console.log("Event Sync Started");
    const res = await axios.get(`${config.services.EventBus.url}/events`, {
      axiosRetry: { retries: 3 },
    });
    for (let { type, data } of res.data) {
      handleEvent(type, data);
    }
    console.log(`Event Sync Complete`);
  } catch (error) {
    console.error("Error syncing events from event-bus service");
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
  }
}

function handlePostCreated(post) {
  if (!posts.hasOwnProperty(post.id)) {
    posts[post.id] = post;
    console.debug(`Post Created <${post.id}>`);
  }
}

function handlePostDeleted(post) {
  const success = delete posts[post.id];
  if (success) console.debug(`Post Deleted <${post.id}>`);
}

function handleCommentCreated(comment) {
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

async function handleCommentUpdated(comment) {
  const post = posts[comment.postId];
  const commentIndex = post.comments.findIndex((x) => x.id === comment.id);
  post.comments[commentIndex] = comment;

  posts[comment.postId] = post;

  console.debug(`Comment Updated <${comment.id}> for Post <${post.id}>`);
}

function handleCommentDeleted(comment) {
  const { postId, id: commentId } = comment;
  const post = posts[postId];

  if (post && post.comments) {
    post.comments = post.comments.filter((c) => c.id !== commentId);
    posts[postId] = post;
    console.debug(`Comment Deleted <${comment.id}> for Post <${post.id}>`);
  }
}

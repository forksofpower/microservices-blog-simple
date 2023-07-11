const express = require("express");
const axios = require("axios");
const { Services } = require("@microservice-blog/common");

const app = express();
app.use(express.json());

const posts = {};

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // console.info(`Recieved Event: ${type}\n`, data);
  switch (type) {
    case "CommentCreated":
      handleCommentCreated(data);
      break;
    default:
    // console.warn(`Ignored Event: ${type}`);
  }
  res.send({ status: "OK" });
});

app.listen(Services.Moderation, () => {
  console.log(`listening on port ${Services.Moderation}`);
});

// Helpers
function emitEvent(type, data) {
  console.debug(`Emitting Event: `, type);
  return axios.post(`http://localhost:${Services.EventBus}/events`, {
    type,
    data,
  });
}

/**
 * @param {Comment} comment
 */
async function handleCommentCreated(comment) {
  const status = comment.content.includes("orange") ? "rejected" : "approved";
  console.debug(
    `Comment ${status.toUpperCase()} <${comment.id}> for Post <${
      comment.postId
    }>`
  );

  comment.status = status;
  await emitEvent("CommentModerated", comment);
}

/**
 * @typedef Comment
 * @type {object}
 * @property {string} id - the comment id
 * @property {string} content - the comment content
 * @property {string} [postId] - the comment post id
 * @property {string} status - comment moderation status
 */

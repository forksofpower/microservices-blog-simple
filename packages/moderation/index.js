const express = require("express");
const axios = require("axios");
const { config } = require("@microservice-blog/common");

const app = express();
app.use(express.json());

const posts = {};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  switch (type) {
    case "CommentCreated":
      handleCommentCreated(data);
      break;
    default:
  }
  res.send({ status: "OK" });
});

app.listen(config.services.Moderation.url, () => {
  console.log(`listening on port ${config.services.Moderation.url}`);
});

// Helpers
function emitEvent(type, data) {
  console.debug(`Emitting Event: `, type);
  return axios.post(`${config.services.EventBus.url}/events`, {
    type,
    data,
  });
}

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

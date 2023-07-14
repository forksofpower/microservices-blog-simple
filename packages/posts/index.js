const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const axios = require("axios");
const {
  Services,
  servs: { services },
} = require("@microservice-blog/common");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = crypto.randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };

  await emitEvent("PostCreated", posts[id]);

  res.send(posts[id]);
});

app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  delete posts[id];

  await emitEvent("PostDeleted", { id });

  res.status(204).end();
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  // console.info(`Recieved Event: ${type}\n`, data);
  switch (type) {
    default:
    // console.warn(`Ignored Event: ${type}`);
  }
  res.send({ status: "OK" });
});

app.listen(Services.Posts, () => {
  console.info(`Listening on port ${Services.Posts}`);
});

function emitEvent(type, data) {
  console.debug(`Emitting Event: `, type);
  return axios.post(`${services.EventBus.url}/events`, {
    type,
    data,
  });
}

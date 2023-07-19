const express = require("express");
const axios = require("axios");
const { config } = require("@microservice-blog/common");

const app = express();

app.use(express.json());

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    emitEventToService(config.services.Posts.url, event);
    emitEventToService(config.services.Comments.url, event);
    emitEventToService(config.services.Query.url, event);
    emitEventToService(config.services.Moderation.url, event);
  } catch (error) {
    console.error(error);
  }

  res.send({ status: "OK" });
});

app.listen(config.services.EventBus.url, () => {
  console.info(`listening on port ${config.services.EventBus.url}`);
});

function emitEventToService(url, data) {
  return axios.post(`${url}/events`, data);
}

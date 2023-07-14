const express = require("express");
const axios = require("axios");
const {
  Services,
  servs: { services },
} = require("@microservice-blog/common");

const app = express();

app.use(express.json());

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);
  console.debug(`Re-Emitting Event: \n${event.type}`, event);
  try {
    emitEventToService(services.Posts.url, event);
    emitEventToService(services.Comments.url, event);
    emitEventToService(services.Query.url, event);
    emitEventToService(services.Moderation.url, event);
  } catch (error) {
    console.error(error);
  }

  res.send({ status: "OK" });
});

app.listen(Services.EventBus, () => {
  console.log(services);
  console.info(`listening on port ${Services.EventBus}`);
});

function emitEventToService(url, data) {
  return axios.post(`${url}/events`, data);
}

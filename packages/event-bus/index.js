const express = require("express");
const axios = require("axios");
const { Services } = require("@microservice-blog/common");

const app = express();

app.use(express.json());

app.post("/events", (req, res) => {
  const event = req.body;

  // console.debug(`Re-Emitting Event: ${event.type}`);
  emitEventToService(Services.Posts, event);
  emitEventToService(Services.Comments, event);
  emitEventToService(Services.Query, event);
  emitEventToService(Services.Moderation, event);

  res.send({ status: "OK" });
});

app.listen(Services.EventBus, () => {
  console.info(`listening on port ${Services.EventBus}`);
});

function emitEventToService(port, data) {
  return axios.post(`http://localhost:${port}/events`, data);
}

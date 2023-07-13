import { ServiceList } from "../services";

export default ServiceList([
  {
    name: "client",
    port: 3000,
    hostname: "client-srv",
  },
  {
    name: "posts",
    port: 4000,
    hostname: "posts-srv",
  },
  {
    name: "comments",
    port: 4001,
    hostname: "comments-srv",
  },
  {
    name: "query",
    port: 4002,
    hostname: "query-srv",
  },
  {
    name: "moderation",
    port: 4003,
    hostname: "moderation-srv",
  },
  {
    name: "event-bus",
    port: 4005,
    hostname: "event-bus-srv",
  },
]);

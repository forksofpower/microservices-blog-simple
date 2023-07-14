import { ServiceList } from "../services";

export const services = ServiceList([
  {
    name: "Client",
    port: 3000,
    hostname: "client-srv",
  },
  {
    name: "Posts",
    port: 4000,
    hostname: "posts-srv",
  },
  {
    name: "Comments",
    port: 4001,
    hostname: "comments-srv",
  },
  {
    name: "Query",
    port: 4002,
    hostname: "query-srv",
  },
  {
    name: "Moderation",
    port: 4003,
    hostname: "moderation-srv",
  },
  {
    name: "EventBus",
    port: 4005,
    hostname: "event-bus-srv",
  },
]);

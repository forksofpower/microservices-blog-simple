import { Services } from "@microservice-blog/common";

export function getServiceUrl(service: Services) {
  return `http://localhost:${service}`;
}

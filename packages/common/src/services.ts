class Service {
  constructor(
    public name: string,
    public port: number,
    public hostname: string
  ) {}
  get url() {
    const host =
      process.env.NODE_ENV === "production" ? this.hostname : "localhost";
    return `http://${host}:${this.port}`;
  }
}

export function ServiceList(
  services: Array<{ name: string; port: number; hostname: string }>
): Record<string, Service> {
  return services.reduce((acc, { name, port, hostname }) => {
    acc[name] = new Service(name, port, hostname);
    return acc;
  }, {} as Record<string, Service>);
}

export enum Services {
  Client = 3000,
  Posts = 4000,
  Comments = 4001,
  Query = 4002,
  Moderation = 4003,
  EventBus = 4005,
}

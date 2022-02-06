import { environment as shared } from "./environment.shared";

export const environment = {
  ...shared,

  production: true,

  server: {
    ...shared.server,
    host: "http://192.168.0.125:3000"
  }
};
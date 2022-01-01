import { environment as shared } from "./environment.shared";

export const environment = {
  production: true,

  app: shared.app,

  server: {
    host: "",
    ...shared.server
  }
};
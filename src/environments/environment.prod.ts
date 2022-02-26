import { config } from "../config";
import { environment as shared } from "./environment.shared";

export const environment = {
  ...shared,

  production: true,

  server: {
    ...shared.server,
    host: config.apiAddress
  }
};
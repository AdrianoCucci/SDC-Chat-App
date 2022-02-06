export const environment = {
  app: {
    name: "SDC-Chat",
    version: "1.0.0",
    tokenEncryptKey: "z[mr%KHw2g'A]~ET!djLgPG_B@rba4"
  },

  server: {
    host: "http://localhost:3000",
    apiPath: "/sdc-chat-api",

    socketConfig: {
      path: "/sdc-chat-api/socket",
      autoConnect: false,
      reconnectionAttempts: 4
    }
  }
};
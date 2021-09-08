export const AUTH_PATHS = {
  root: "auth",
  children: {
    login: "login"
  }
}

export const MAIN_PATHS = {
  root: "main",
  children: {
    pings: "pings",
    chat: "chat"
  }
}

export const APP_PATHS = {
  auth: AUTH_PATHS,
  main: MAIN_PATHS
}
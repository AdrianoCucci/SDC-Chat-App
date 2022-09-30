export const ACCOUNT_PATHS = {
  root: 'account',
  children: {
    details: 'details',
    organization: 'organization',
    notifications: 'notifications',
    accessibility: 'accessibility',
  },
};

export const AUTH_PATHS = {
  root: 'auth',
  children: {
    login: 'login',
  },
};

export const MAIN_PATHS = {
  root: 'main',
  children: {
    account: ACCOUNT_PATHS,
    organizations: 'organizations',
    users: 'users',
    rooms: 'rooms',
    chat: 'chat',
    pings: 'pings',
  },
};

export const APP_PATHS = {
  auth: AUTH_PATHS,
  main: MAIN_PATHS,
};

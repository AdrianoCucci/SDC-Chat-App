import { environment as shared } from './environment.shared';
import { ManagerOptions, SocketOptions } from 'socket.io-client';

export const environment = {
  ...shared,

  production: true,

  server: {
    ...shared.server,
    host: 'https://api.chat.sorissodental.care',
    apiPath: '',

    socketConfig: <Partial<SocketOptions & ManagerOptions>>{
      ...shared.server.socketConfig,
      path: '/socket',
    },
  },
};

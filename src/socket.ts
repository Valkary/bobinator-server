import { Server } from 'socket.io';
import { SocketPort, ClientURL, TauriURL } from './constants';

export const io = new Server(SocketPort, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});
import { Server } from 'socket.io';
import { SocketPort, ClientURL, TauriURL } from './constants';

export const io = new Server(SocketPort, {
  cors: {
    origin: [ClientURL, TauriURL],
    methods: ["GET", "POST"]
  }
});
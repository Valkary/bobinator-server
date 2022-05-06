import { Server } from 'socket.io';
import { SocketPort, ClientURL } from './constants';

export const io = new Server(SocketPort, {
  cors: {
    origin: ClientURL,
    methods: ["GET", "POST"]
  }
});
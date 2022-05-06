import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './routes';
import { Port } from './constants';
import { io } from './socket';

import { logIntoDB } from './functions/logs/logIntoDB';

const app: Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/', router);

app.listen(Port, () => console.log(`Server running on port ${Port}!`));

io.on("connection", (socket) => {
  console.log("Socket connected!");

  socket.on('connected-from', (page) => {
    console.log(`Connection opened from ${page}`);
  });
  
  socket.on("send-log", async (message: string) => {
    const log_into_db = await logIntoDB(message);
    
    if(log_into_db.success) {
      io.emit('recieve-log', message);
    }
  });
});
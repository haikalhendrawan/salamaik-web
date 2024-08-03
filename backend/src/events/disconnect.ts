import { Socket } from 'socket.io';
import logger from '../config/logger';

export default function disconnectEventListener(socket: Socket) {
  socket.on('disconnect', () => {
    logger.info('user disconnected' + socket.id);
  });
};
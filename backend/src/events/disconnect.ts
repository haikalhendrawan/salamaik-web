import { Socket } from 'socket.io';

export default function disconnectEvent(socket: Socket) {
  socket.on('disconnect', () => {
    console.log('user disconnected' + socket.id);
  });
};
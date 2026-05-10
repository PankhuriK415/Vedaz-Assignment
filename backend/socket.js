const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, { 
      cors: { 
        origin: ['https://vedaz-assignment-six.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
        credentials: true
      } 
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
  }
};
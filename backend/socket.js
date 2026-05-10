const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, { 
      cors: { 
        origin: function(origin, callback) {
          return callback(null, true);
        },
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
const projectContoller = require("../controllers/projectController");
const logger = require("../utils/logger");
const io = require("socket.io")();

function attachServer(server) {
  io.attach(server);

  io.on('connection', (socket) => {
    socket.emit('news', {
      message: "서버 연결 성공"
    });
    logger.log("socket connected " + socket.id);

    socket.on('onCodeChanged', (data) => {
      projectContoller.saveToBuffer(data);
    })
    socket.on('forceSave', (data) => {
      projectContoller.bufferToDB(data);
    })

    socket.on('disconnect', (data) => {
      logger.log("socket disconnected" + socket.id);
      projectContoller.bufferToDB(data);
    })
  });
}

io.attachServer = attachServer;

module.exports = io;
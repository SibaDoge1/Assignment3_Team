const projectContoller = require("../controllers/projectController");
const logger = require("../utils/logger");

function attachEvent(io) {
  io.on('connection', (socket) => {
    socket.emit('news', { message: "서버 연결 성공" });
    logger.log("socket connected" + socket.id);

    socket.on('OnCodeChanged', (data) => {
      projectContoller.saveToBuffer(data);
    })
    socket.on('ForceSave', (data) => {
      projectContoller.bufferToDB(data);
    })

    socket.on('disconnect', (data) => {
      logger.log("socket disconnected" + socket.id);
      projectContoller.bufferToDB(data);
    })
  });
}

module.exports.attachEvent = attachEvent;
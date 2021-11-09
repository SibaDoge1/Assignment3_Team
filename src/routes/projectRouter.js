const express = require("express");
const routes = require('../globals').routes;

const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth')

const projectRouter = express.Router();


// 프로젝트 생성
projectRouter.post(routes.root, auth.checkToken, projectController.createProject);

// 내 프로젝트 리스트
projectRouter.get(routes.root, auth.checkToken, projectController.getMyProjectList);

// 내 프로젝트 리스트
projectRouter.get(routes.projectMyDetail, auth.checkToken, projectController.getMyProjectDetail);

// 내 프로젝트 리스트
projectRouter.delete(routes.projectMyDetail, auth.checkToken, projectController.deleteMyProject);

//소켓테스트용
//projectRouter.post('/socket', projectController.saveToBuffer);
//소켓테스트용
//projectRouter.post('/socket1', projectController.bufferToDB);


module.exports = projectRouter;
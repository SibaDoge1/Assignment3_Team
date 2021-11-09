const express = require('express');

const routes = require('../globals/routes.js');
const { checkToken } = require('../middlewares/auth.js');
const gameController = require('../controllers/gameController.js');

const gameRouter = express.Router();


// 게임 목록 조회
gameRouter.get(routes.root, gameController.getGameList);

// 게임 상세 조회
gameRouter.get(routes.gameDetail, gameController.getGame);

// 좋아요 추가
gameRouter.post(routes.gameDetail + routes.gameLike, checkToken,
	gameController.postGameLike);
	
// 좋아요 삭제
gameRouter.delete(routes.gameDetail + routes.gameLike, checkToken,
	gameController.deleteGameLike);
		
// 게임, 만든이 검색
gameRouter.get(routes.search, gameController.searchGame);

// 게임 배포
gameRouter.post(routes.root, checkToken, gameController.releaseGame);

module.exports = gameRouter;
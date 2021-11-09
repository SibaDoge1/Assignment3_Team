const { resFormatter } = require('../utils');
const { statusCode, responseMessage } = require('../globals');
const { ValidationError, NotMatchedGameError, UnAuthorizedError } = require('../utils/errors/gameError');

const gameService = require('../services/gameService.js');
const logger = require('../utils/logger');

// 게임 목록 조회(10개)
exports.getGameList = async (req, res, next) => {
	try {
		// 쿼리 실행
		const gameList = await gameService.readGameList();

		// Response Code : 200 
		return res.status(statusCode.OK)
		  .send(resFormatter.success(responseMessage.READ_GAME_SUCCESS, gameList));
	} catch (err) {
		next(err);
	}
}

// 게임 상세 조회
exports.getGame = async (req, res, next) => {
	try {
		const gameId = req.params.gameId;
		// 입력값 없으면 에러처리 NULL_VALUE : 400

		if (!gameId)
		throw new ValidationError();
		
		// 쿼리 실행
		const game = await gameService.readGame(gameId);

		// DB에 없으면 에러처리 
		if (!game)
			throw new NotMatchedGameError();
		// 조회수 증가
		await gameService.updateCount(gameId, ++game.count);
		
		// Response Code : 200 
		return res.status(statusCode.OK)
		  .send(resFormatter.success(responseMessage.READ_GAME_SUCCESS, game));
	} catch (err) {
		next(err);
	}
}

// 좋아요 추가
exports.postGameLike = async (req, res, next) => {
	try {
		const gameId = req.params.gameId;
		const { _id } = req.decoded;

		// 입력값 없으면 에러처리 NULL_VALUE : 400
		if (!gameId)
			throw new ValidationError();

		// 인증 에러처리 UNAUTHORIZED: 401
		if (!_id)
			throw new UnAuthorizedError();
		
		// 쿼리 실행
		const likeCount = await gameService.createGameLike(_id, gameId);

		// DB에 없으면 에러처리 
		if (likeCount === undefined)
			throw new NotMatchedGameError();

		//Response 201 CREATED
		return res.status(statusCode.CREATED)
		  .send(resFormatter.success(responseMessage.CREATE_LIKE_SUCCESS, {'like': likeCount}));
	} catch (err) {
		next(err);
	}
}

// 좋아요 삭제
exports.deleteGameLike = async (req, res, next) => {
	try {
		const gameId = req.params.gameId;
		const { _id } = req.decoded;

		// 입력값 없으면 에러처리 NULL_VALUE : 400
		if (!gameId)
			throw new ValidationError();
		// 인증 에러처리 UNAUTHORIZED: 401
		if (!_id)
			throw new UnAuthorizedError();

		// 쿼리 실행
		const likeCount = await gameService.deleteGameLike(_id, gameId);

		// DB에 없으면 에러처리 
		if (likeCount === undefined)
			throw new NotMatchedGameError();

		// Response 200 OK
		return res.status(statusCode.OK)
		  .send(resFormatter.success(responseMessage.DELETE_LIKE_SUCCESS, {'like': likeCount}));
	} catch (err) {
		next(err);
	}
}

// 게임, 만든이 검색
exports.searchGame = async (req, res, next) => {
	try {
		const content = req.query.content;

		// 입력값 없으면 에러처리 NULL_VALUE : 400
		if (content.length === 0)
			throw new ValidationError();

		// 쿼리 실행
		const search = await gameService.searchGame(content);

		// Response Code : 200 
		return res.status(statusCode.OK)
		  .send(resFormatter.success(responseMessage.READ_GAME_SUCCESS, search));
	} catch (err) {
		next(err);
	}
}

// 게임 배포
exports.releaseGame = async (req, res, next) => {
	try {
		const { projectName, projectData, projectId } = req.body;
		const { _id } = req.decoded;

		// 입력값 없으면 에러처리 NULL_VALUE : 400
		if (!projectName || !projectData || !projectId)
			throw new ValidationError();
		
		// 쿼리 실행
		const releaseGame = await gameService.postOrUpdateGame(projectName, projectData, projectId, _id);

		//Response 201 CREATED
		return res.status(statusCode.CREATED)
		  .send(resFormatter.success(responseMessage.CREATE_GAME_SUCCESS, releaseGame));
	} catch (err) {
		next(err);
	}
}
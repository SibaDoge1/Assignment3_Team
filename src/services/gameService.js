const Release = require('../models/releaseModel.js');
const Like = require('../models/likeModel.js');
const User = require('../models/userModel.js');

// 조회수 증가
exports.updateCount = async (gameId, count) => {
	try {
		const game = await Release.findOneAndUpdate({
			_id: gameId
		},
		{
			count
		});

		return game;
	} catch (err) {
		throw err;
	}
}

// 게임 목록 조회(10개)
exports.readGameList = async () => {
	try {
		// const gameList = await Release.find({ projectData: 0 })
		// 	.sort({ 'createdAt': -1 })
		// 	.limit(10)
		
		// TODO: 좋아요 추가 (for문 또 돌아서..?)
		// let size = gameList.length;
		// let done = [];
		// let copy = JSON.parse(JSON.stringify(gameList));

		// copy.forEach((game, idx, _games) => {
		// 	Like.find({
		// 		"releaseId": { _id: game._id }
		// 	}).then(likes => {
		// 		game.like = likes.length;
		// 		done.push(game);
		// 		if (done.length === size) {
		// 			return copy;
		// 		}
		// 	}).catch((err) => {
		// 		throw(err);
		// 	})
			
		// })
		// return gameList;
		


		return Promise.all(Release.find({ projectData: 0}).sort({ 'createdAt': -1 })
		.limit(10))
		.then(game => {
			const likeCount = Like.find({
				"releaseId": { _id: game._id }
			}).length;
			game["like"] = likeCount;
		});





	} catch (err) {
		throw err;
	}
}

// 게임 상세 조회
exports.readGame = async (gameId) => {
	try {
		const game = await Release.findById({
			_id: gameId
		});
		console.log(game);
		const author = await User.findById({
			_id: game.authorId._id
		});

		game["authorName"] = author.username;

		const like = await Like.find({
			"releaseId": { _id: gameId }
		}).length;

		game["like"] = like;

		return game;
	} catch (err) {
		throw err;
	}
}

// 좋아요 추가
exports.createGameLike = async (authorId, gameId) => {
	try {
		const addLike = await Like.create({
			"authorId": { _id: authorId },
			"releaseId": { _id: gameId }
		});

		const likeCount = await Like.find({
			"releaseId": { _id: gameId }
		}).length;

		return likeCount;
	} catch (err) {
		throw err;
	}
}

// 좋아요 삭제
exports.deleteGameLike = async (authorId, gameId) => {
	try {
		await Like.deleteOne({
			$and: [
				{"authorId": { _id: authorId }},
				{"releaseId": { _id: gameId }}
			]
		});

		const likeCount = await Like.find({
			"releaseId": { _id: gameId }
		}).length;

		return likeCount;
	} catch (err) {
		throw err;
	}
}

// 게임 검색
exports.searchGame = async (content) => {
	try {
		// let options = [];
		// options.push({ "authorId": { _id: authorId } });
		// options.push({ "projectName": new RegExp(content) });

		const results = await Release.find({
			$or: [{projectName: { $regex: content }}, {authors : { userName: { $regex: content }}}]
		  })
			.sort({ 'createdAt': -1 });

		return results;
	} catch (err) {
		throw err;
	}
}

// 게임 배포
exports.postOrUpdateGame = async (projectName, projectData, projectId, _id) => {
	try {

	} catch (err) {
		throw err;
	}
}
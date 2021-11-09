const Release = require('../models/releaseModel.js');
const Like = require('../models/likeModel.js');
const User = require('../models/userModel.js');

// 조회수 증가
exports.updateCount = async (gameId, count) => {
  try {
    const game = await Release.findOneAndUpdate(
      {
        _id: gameId,
      },
      {
        count,
      },
    );
    return game;
  } catch (err) {
    throw err;
  }
};

// 게임 목록 조회(10개)
exports.readGameList = async () => {
  try {
    const gameList = await Release.find({}, { projectData: false })
      .populate('likes')
      .sort({ createdAt: -1 })
      .limit(10).lean();
    return gameList;
  } catch (err) {
    throw err;
  }
};

// 게임 상세 조회
exports.readGame = async gameId => {
  try {
    const game = await Release.findById({
      _id: gameId,
    }).populate('likes').lean();
	if (game === null)
		return ;
    const author = await User.findById({
      _id: game.authorId._id,
    });
	game["authorName"] = author.username;
	
    return game;
  } catch (err) {
    throw err;
  }
};

// 좋아요 추가
exports.createGameLike = async (authorId, gameId) => {
  try {
    await Like.create({
      authorId: { _id: authorId },
      releaseId: { _id: gameId },
    });

    const likeCount = await Like.find({
      releaseId: { _id: gameId },
    });

    return likeCount.length;
  } catch (err) {
    throw err;
  }
};

// 좋아요 삭제
exports.deleteGameLike = async (authorId, gameId) => {
  try {
    await Like.deleteOne({
      $and: [{ authorId: { _id: authorId } }, { releaseId: { _id: gameId } }],
    });

    const likeCount = await Like.find({
      releaseId: { _id: gameId },
    });

    return likeCount.length;
  } catch (err) {
    throw err;
  }
};

// 게임 검색
exports.searchGame = async content => {
  try {
	// 게임 이름 또는 만든 사람으로 출시된 게임 찾기
    const results = await Release.find({
      $or: [
        { projectName: { $regex: content } },
        { authorName: { $regex: content } } 
      ],
    }).sort({ createdAt: -1 });

    return results;
  } catch (err) {
    throw err;
  }
};

// 게임 배포
exports.postOrUpdateGame = async (
  projectName,
  projectData,
  projectId,
  authorId,
) => {
  try {
	// 만든 사람 이름찾기
    const author = await User.findById({
      _id: authorId
    })

    // 배포한 게임에 덮어쓰기
    const updateGame = await Release.findOneAndUpdate(
      {
        projectId: { _id: projectId },
      },
      {
        projectName,
        projectData,
        authorId: { _id: authorId },
        authorName: author.username,
        projectId: { _id: projectId },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return updateGame;
  } catch (err) {
    throw err;
  }
};

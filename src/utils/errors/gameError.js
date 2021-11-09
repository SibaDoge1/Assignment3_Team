const statusCode = require('../../globals/statusCode');
const responseMessage = require('../../globals/responseMessage');
const Error = require('./errors');

//Code : 400 gameId가 누락되었거나 숫자가 아님 
class ValidationError extends Error {
  constructor(message = responseMessage.NULL_VALUE, status = statusCode.BAD_REQUEST) {
    super(message);
    this.status = status;
  }
}

//Code : 404 gameId에 해당하는 게임이 존재하지 않음
class NotMatchedGameError extends Error {
  constructor(message = responseMessage.NO_GAME, status = statusCode.NOT_FOUND) {
    super(message);
    this.status = status;
  }
}

//Code : 401 jwt 미인증
class UnAuthorizedError extends Error {
  constructor(message = responseMessage.PERMISSION_ERROR, status = statusCode.UNAUTHORIZED) {
    super(message);
    this.status = status;
  }
}

module.exports.ValidationError = ValidationError;
module.exports.NotMatchedGameError = NotMatchedGameError;
module.exports.UnAuthorizedError = UnAuthorizedError;
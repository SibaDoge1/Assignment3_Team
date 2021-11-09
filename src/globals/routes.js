//경로 변수들 모음

// Root
const ROOT = '/';

// User
const USER_SIGNUP = '/user';
const USER_SIGNIN = '/token';

//Project
const PROJECT_MY = '/projects/my'
const PROJECT_MY_DETAIL = '/:projectId'

// Game
const GAME = '/games';
const GAME_DETAIL = '/:gameId';
const GAME_LIKE = '/like';
const GAME_SEARCH = '/search';

const routes = {
  root: ROOT,
  user: USER_SIGNUP,
  token: USER_SIGNIN,
  project: PROJECT_MY,
  projectMyDeatail: PROJECT_MY_DETAIL,
  game: GAME,
  gameDetail: GAME_DETAIL,
  gameLike: GAME_LIKE,
  search: GAME_SEARCH,
}

module.exports = routes;




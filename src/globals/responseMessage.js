//응답 메시지 모음

module.exports = {
  SUCCESS: 'Request 성공',
  NULL_VALUE: '필요한 값이 없습니다.',
  OUT_OF_VALUE: '파라미터 값이 잘못되었습니다.',
  WRONG_INDEX: '잘못된 인덱스 접근입니다.',
  DB_ERROR: 'DB 오류',
  INTERNAL_SERVER_ERROR: '서버 오류입니다.',
  DUPLICATE_ERROR: '중복된 요청입니다.',
  PERMISSION_ERROR: '권한이 없습니다.',
  ENTITY_NOT_EXIST: "DB에 없는 데이터 관련 요청입니다.",
  NO_PAGE_ERROR: "해당 라우트는 존재하지 않습니다.",

  // token
  EMPTY_TOKEN: '토큰 값이 없습니다.',
  EXPIRED_TOKEN: '토큰 값이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰값입니다.',
  AUTH_SUCCESS: '인증에 성공했습니다.',
  ISSUE_SUCCESS: '새로운 토큰이 생성되었습니다.',

  // 회원가입
  CREATED_USER: '회원 가입 성공',
  ALREADY_EMAIL: '이미 사용중인 이메일입니다.',
  AVAILABLE_USERNAME: '사용 가능한 아이디입니다.',
  SUCCESS_SNS_CHECK: '가입되어 있는 계정입니다.',
  FAIL_SNS_CHECK: '가입되어 있지 않은 계정입니다.',
  //FAIL_SINGUP: '회원 가입 실패',

  // 로그인
  LOGIN_SUCCESS: '로그인 성공',
  //LOGIN_FAIL: '로그인 실패',
  LOGOUT_SUCCESS: '로그아웃 성공',
  NO_USER: '존재하지 않는 회원입니다.',
  MISS_MATCH_PW: '비밀번호가 맞지 않습니다.',

  //프로젝트
  PROJECT_CREATED: '프로젝트 생성 성공',
  PROJECT_MY_LIST: '내 프로젝트 목록',
  PROJECT_DELETED: '프로젝트 삭제 성공'

  // 게임(퍼블리시)
  CREATE_GAME_SUCCESS: '게임 배포 성공',
  READ_GAME_SUCCESS: '게임 조회 성공',
  READ_GAME_FAIL: '게임 조회 실패',
  CREATE_LIKE_SUCCESS: '좋아요 추가 성공',
  DELETE_LIKE_SUCCESS: '좋아요 삭제 성공',
  NO_GAME: '해당 게임이 없습니다.',
};
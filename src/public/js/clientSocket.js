// socket.io 서버에 접속한다
var socket = io();

const titleForm = document.querySelector('#titleForm');
const contentForm = document.querySelector('#contentForm');

const saveGameButton = document.querySelector('#saveGame');
const startGameButton = document.querySelector('#startGame');

/* 
시나리오
1. join 이벤트 발생 
  - 서버 emit 클라이언트 on
    - 처음 게임을 만든 경우 -> projectId만 받아옴. 
    - 기존 게임을 수정하는 경우 -> projectId, title, content를 서버에서 받아옴. 
    - 퍼블리싱된 게임을 수정하는 경우 -> projectId, title, content를 서버에서 데이터를 받아야 함. 

2. OnCodeChanged 이벤트 발생 
  - 서버 on 클리이언트 emit
  - projectId, title, content를 서버에게 전달.   
  - 텍스트 박스 엔터를 입력할 때, 제출 버튼을 누를 때 
3. Quit 이벤트 발생 
  - 서버 on 클리이언트 emit
  - projectId, title, content를 서버에게 전달.    
*/

// 1. join 이벤트를 받아 game정보 출력
socket.on('join', (data) => {
  console.log(data);
})

// 2. 텍스트 박스 값 변경 시 OnCodeChanged 이벤트 emit
function OnCodeChanged() {
  const data = {
    projectId: projectId.value,
    projectName: titleForm.value,
    projectData: contentForm.value
  }
  socket.emit("OnCodeChanged", data);
}

// 3. 게임 퍼블리시 버튼 클릭 시 Quit 이벤트 emit
function gamePublishButtonClick() {
  const data = {
    projectId: projectId,
    projectName: titleForm.value,
    projectData: contentForm.value
  }

  socket.emit("ForceSave", data);

  const token = document.cookie

  // 퍼블리시 하는 API Post로 연결
  const url = 'http//localhost:3000/games'
  // const options = {
  //   method: "POST",
  //   headers: {

  //   },
  //   body: JSON.stringify(data)
  // }
  // fetch(url, options)
}

let username = getQueryStrings().username;

function getQueryStrings() {
  let params = {};

  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function (str, key, value) {
      params[key] = value;
    }
  );

  return params;
}
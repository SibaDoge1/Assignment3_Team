// socket.io 서버에 접속한다
var socket = io();

const titleForm = document.querySelector('#titleForm');
const contentForm = document.querySelector('#contentForm');
const projectId = document.getElementById('projectId');

const saveGameButton = document.querySelector('#saveGame');
const startGameButton = document.querySelector('#startGame');


// news 이벤트를 받아 콘솔에 출력
socket.on('news', (data) => {
  console.log(data);
})

//에러 발생 시
socket.on('onError', (data) => {
  console.log(data);
})


//텍스트 박스 값 변경 시 서버에 프로젝트내용 전송
//timer를 통해 최대 0.5초에 한번만 전송함
let isCoolTime = false;
function OnCodeChanged() {
  if (!isCoolTime) {
    //타이머로 전송예약함
    setTimeout(saveCodeData, 500)

    //쿨타임 설정
    isCoolTime = true;
    
    //타이머로 쿨타임 해제
    setTimeout(function () {
      isCoolTime = false;
    }, 500)
  }
}

//전송하는 부분
function saveCodeData() {
  let data = {
    projectId: projectId.innerText,
    projectName: titleForm.value,
    projectData: contentForm.value
  }
  socket.emit("onCodeChanged", data);
}

// 퍼블리시 버튼 클릭 시 서버에 퍼블리시하도록 post요청
function gamePublishButtonClick() {
  const data = {
    projectId: projectId.innerText,
    projectName: titleForm.value,
    projectData: contentForm.value
  }

  //퍼블리시 전 저장
  socket.emit("forceSave", data);

  const token = document.cookie['AG3_JWT'];

  // 퍼블리시 하는 API Post로 연결
  const url = window.location.origin+'/games'
  const options = {
    method: "POST",
    headers: {
      Authorization: token
    },
    body: JSON.stringify(data)
  }
  fetch(url, options).then((res)=>{
    console.log(res);
    if(res.status == 201){
      alert("등록 성공!");
    }
    else{
      return res.json();
    }
  }).then((body)=>{
    if(body.message != undefined){
      alert("등록 실패! : "+body.message);
    }
  })
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
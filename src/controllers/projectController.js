const {
    statusCode,
    responseMessage
} = require('../globals');
const encryption = require('../libs/encryption.js');
const jwt = require('../libs/jwt.js');
const {
    resFormatter
} = require('../utils');
const {
    ValidationError,
    DuplicatedError,
    PasswordMissMatchError,
    NotMatchedUserError
} = require('../utils/errors/userError');
const {
    EntityNotExistError
} = require('../utils/errors/commonError');

const userService = require('../services/userService.js');
const logger = require('../utils/logger');
const {
    updateProject
} = require('../services/projectService');

const saveDataBuffer = new Map();
const saveTimerBuffer = new Map();


exports.createProject = async (req, res, next) => {
    try {
        const {
            email,
            projectName
        } = req.body
        const username = req.decoded.username

        //email, projectName이 누락되었거나 email과 jwt의 mismatch
        if (email === undefined || projectName === undefined || email != username) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const responseData = {
            projectId: null
        }

        return res
            .status(statusCode.CREATED)
            .send(resFormatter.success(responseMessage.PROJECT_CREATED, responseData)) // TODO 위에서 생성한뒤 얻은 projectId

    } catch (err) {
        next(err)
    }
}

exports.getMyProjectList = async (req, res, next) => {
    try {
        const noParameter = req.body

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const responseData = [{
            projectId: null,
            projectName: null,
            projectData: null,
            release: {
                isReleased: null,
                releaseId: null
            }
        }

        ]

        return res
            .status(statusCode.OK)
            .send(resFormatter.success(responseMessage.PROJECT_MY_LIST, responseData)) // TODO 위에서 생성한뒤 얻은 projectId
    } catch (err) {
        next(err)
    }
}

exports.getMyProjectDetail = async (req, res, next) => {
    try {
        const {
            projectId
        } = req.params
        const username = req.decoded.username

        if (isNaN(projectId)) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 렌더링에 포함할 정보 입력
        const responseData = {
            projectId: null,
            projectName: null,
            projectData: null,
        }

        // CHECK TODO 다른 추가적인 메세지는 html에서 처리?
        res.status(statusCode.OK).render("gameEditor.html", responseData)

    } catch (err) {
        next(err)
    }

}

exports.deleteMyProject = async (req, res, next) => {
    try {
        const {
            projectId
        } = req.params
        const username = req.decoded.username
        if (isNaN(projectId)) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 프로젝트 정보 삭제


        const responseData = undefined

        return res
            .status(statusCode.OK)
            .send(resFormatter.success(responseMessage.PROJECT_MY_LIST, responseData)) // TODO 위에서 생성한뒤 얻은 projectId

    } catch (err) {
        next(err)
    }

}


//프로젝트 정보를 임시로 버퍼에 저장
exports.saveToBuffer = async (data) => {
    try {
        logger.log('saveToBuffer data received \n' + JSON.stringify(data));
        if (data == undefined || data.projectName == undefined || data.projectData == undefined || data.projectId == undefined) {
            throw new ValidationError();
        }

        saveDataBuffer.set(data.projectId, {
            content: data.content,
            title: data.title
        });

        if (!saveTimerBuffer.get(data.projectId)) {
            let timer = setTimeout(this.bufferToDB, 5000, {
                projectId: data.projectId
            });
            saveTimerBuffer.set(data.projectId, timer);
        }
        logger.log('saveToBuffer compelte');
    } catch (err) {
        throw err;
    }
}


//버퍼혹은 받아온 데이터를 DB에 저장
exports.bufferToDB = async (data) => {
    try {
        logger.log('bufferToDB data received \n' + JSON.stringify(data));
        let lastestData = {};

        if (data == undefined || data.projectId == undefined) {
            throw new ValidationError();
        }

        if (data.projectName == undefined || data.projectData == undefined) {
            lastestData = saveDataBuffer.get(data.projectId);
        } else {
            lastestData = data;
        }

        //let proeject = await updateProject(lastestData.projectId, lastestData.projectName, lastestData.projectData);
        let project = {
            projectId: "테스트성공"
        };
        if (!project) {
            //throw new EntityNotExistError();
        } else {
            saveDataBuffer.delete(data.projectId);
            saveTimerBuffer.delete(data.projectId);
        }
        logger.log('bufferToDB completed \n' + project.projectId);
    } catch (err) {
        throw err;
    }
}


//  회원가입
// exports.postUser = async (req, res, next) => {
//   try {
//     const { email, password, isAdmin } = req.body;

//     //입력값 확인
//     if (email === undefined || password === undefined) {
//       throw new ValidationError();
//     }
//     const emailUsername = email.split('@')[0];
//     const emailDomain = email.split('@')[1];

//     //이메일 양식 일치/불일치 여부 : isMatch가 0이면 일치, -1이면 불일치
//     const regExp = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
//     const isMatch = email.search(regExp);
//     if (isMatch === -1) throw new ValidationError();

//     //이메일 중복 여부
//     const isEmail = await userService.checkEmail(emailUsername, emailDomain);
//     if (isEmail) throw new DuplicatedError()

//     //암호화
//     const salt = encryption.makeSalt();
//     const encryptPassword = encryption.encrypt(password, salt);

//     //쿼리실행
//     await userService.signup(emailUsername, emailDomain, encryptPassword, salt, isAdmin);

//     return res.status(statusCode.CREATED)
//       .send(resFormatter.success(responseMessage.CREATED_USER));
//   } catch (err) {
//     next(err);
//   }
// }


// //토큰 생성(로그인)
// exports.postToken = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     //입력값 확인
//     if (email === undefined || password === undefined) throw new ValidationError();

//     const emailUsername = email.split('@')[0];
//     const emailDomain = email.split('@')[1];

//     //이메일 존재 여부
//     const isEmail = await userService.checkEmail(emailUsername, emailDomain);
//     if (!isEmail) throw new NotMatchedUserError();

//     //확인용 암호화
//     const { salt, password: realPassword } = isEmail;
//     const inputPassword = encryption.encrypt(password, salt);

//     //패스워드 불일치
//     if (inputPassword !== realPassword) throw new PasswordMissMatchError();

//     //쿼리 실행
//     const user = await userService.signin(emailUsername, emailDomain, inputPassword);

//     //토큰 반환
//     const { accessToken } = await jwt.sign(user);

//     return res.status(statusCode.OK)
//       .send(resFormatter.success(responseMessage.LOGIN_SUCCESS, { accessToken }))
//   } catch (err) {
//     next(err);
//   }
// }
const { statusCode, responseMessage } = require('../globals');
const encryption = require('../libs/encryption.js');
const jwt = require('../libs/jwt.js');
const { resFormatter } = require('../utils');
const { ValidationError, DuplicatedError, PasswordMissMatchError, NotMatchedUserError } = require('../utils/errors/userError');
const { EntityNotExistError } = require('../utils/errors/commonError');

const userService = require('../services/userService.js');
const logger = require('../utils/logger');
const { updateProject } = require('../services/projectService');

const saveDataBuffer = new Map();
const saveTimerBuffer = new Map();


exports.createProject = async (req, res, next) => {
    try {
        const { username, projectName } = req.body
        const verified = req.decoded.username

        //email, projectName이 누락되었거나 email과 jwt의 mismatch
        if (username === undefined || projectName === undefined || username != verified) {
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
        const { username } = req.query
        const { verified } = req.decoded

        if (username === undefined || username != verified) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const responseData = [
            {
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
        const { projectId } = req.params
        const { username } = req.query
        const { verified } = req.decoded

        if (username === undefined || username != verified) {
            throw new ValidationError();
        }

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
        const { projectId } = req.params
        const { username } = req.query
        const { verified } = req.decoded

        if (username === undefined || username != verified) {
            throw new ValidationError();
        }

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
const { statusCode, responseMessage } = require('../globals');
const { resFormatter } = require('../utils');
const { ValidationError } = require('../utils/errors/userError');
const { UnAuthorizedError } = require('../utils/errors/gameError');
const { createProject, getProjectList, getProject, deleteProject } = require('../services/projectService');


const FILE_PATH = "../public/gameEditor.html"


exports.createProject = async (req, res, next) => {
    try {
        const { username, projectName } = req.body
        const verified = req.decoded.username

        //email, projectName이 누락되었거나 email과 jwt의 mismatch
        if (username === undefined || projectName === undefined || username != verified) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const dbResolve = await createProject({
            authorId: req.decoded._id,
            projectName: projectName,
            projectData: "",
        })

        const responseData = {
            projectId: dbResolve._id
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
        const verified  = req.decoded.username

        

        if (username === undefined || username != verified) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const dbResolve = await getProjectList(req.decoded._id)

        // TODO projectService를 이용하여 새로 생성 및 responseData에 삽입
        const responseData = dbResolve

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
        const verified = req.decoded.username


        if (username === undefined || username != verified) {
            throw new ValidationError();
        }
        if (isNaN("0x"+projectId)) {
            throw new ValidationError();
        }

        // TODO projectService를 이용하여 렌더링에 포함할 정보 입력
        const dbResolve = await getProject(projectId)

        if(dbResolve.authorId != req.decoded._id){
            throw new UnAuthorizedError()
        }

        const responseData = {
            projectId: dbResolve._id,
            projectName: dbResolve.projectName,
            projectData: dbResolve.projectData,
            cookie : req.cookies
        }

        console.log("getProject : " , responseData)

        // CHECK TODO 다른 추가적인 메세지는 html에서 처리?
        res.status(statusCode.OK).render(FILE_PATH, responseData)

    } catch (err) {
        next(err)
    }

}

exports.deleteMyProject = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const { username } = req.query
        const verified = req.decoded.username


        if (username === undefined || username != verified) {
            throw new ValidationError();
        }
        if (isNaN("0x"+projectId)) {
            throw new ValidationError();
        }

        const isExists = await getProject(projectId)
        console.log("isExists ",isExists)

        if(!isExists){
            throw new ValidationError()
        }

        // TODO projectService를 이용하여 프로젝트 정보 삭제
        const dbResolve = await deleteProject(projectId)

        if(dbResolve.authorId != req.decoded._id){
            throw new UnAuthorizedError()
        }

        const responseData = {}

        return res
            .status(statusCode.OK)
            .send(resFormatter.success(responseMessage.PROJECT_DELETED, responseData)) // TODO 위에서 생성한뒤 얻은 projectId

    } catch (err) {
        next(err)
    }

}


//프로젝트 정보를 임시로 버퍼에 저장
exports.saveToBuffer = async (data) => {
    try {
        //입력값 이상 확인
        if (data === undefined || data.projectName === undefined || 
            data.projectData === undefined || data.projectId === undefined) {
            throw new ValidationError();
        }

        //버퍼에 입력
        saveDataBuffer.set(data.projectId, data);

        //일정 시간 뒤 저장함수 실행
        if (!saveTimerBuffer.get(data.projectId)) {
            let timer = setTimeout(this.bufferToDB, 5000, {
                projectId: data.projectId
            });
            saveTimerBuffer.set(data.projectId, timer);
        }
    } catch (err) {
        throw err;
    }
}


//버퍼혹은 받아온 데이터를 DB에 저장
exports.bufferToDB = async (data) => {
    try {
        let lastestData = {};

        //입력값 이상 확인
        if (data === undefined || data.projectId === undefined) {
            throw new ValidationError();
        }

        //console.log(saveDataBuffer.get(data.projectId));
        //버퍼와 받아온 데이터 중 넣을 데이터 선택
        if (data.projectName === undefined || data.projectData === undefined) {
            lastestData = saveDataBuffer.get(data.projectId);
        } else {
            lastestData = data;
        }

        //쿼리 실행
        let project = await updateProject(lastestData.projectId, lastestData.projectName, lastestData.projectData);

        //db에 없을 시
        if (project === undefined) {
            throw new EntityNotExistError();
        }
        //정상 결과 시
        else {
            saveDataBuffer.delete(data.projectId);
            saveTimerBuffer.delete(data.projectId);
        }

    } catch (err) {
        throw err;
    }
}
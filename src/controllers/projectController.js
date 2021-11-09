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

        console.log()

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


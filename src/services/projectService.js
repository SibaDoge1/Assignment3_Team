const logger = require("../utils/logger");

const projectModel = require("../models/projectModel");

module.exports.updateProject = async (projectId, projectName, projectData) => {
  try {
    let project = await projectModel.findOneAndUpdate({
      projectId
    }, {
      projectData,
      projectName
    }, {
      new: true
    })

    return project;
  } catch (err) {
    throw err;
  }
}
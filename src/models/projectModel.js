const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectData: {
      type: String,
      required: false,
    },
    releaseId: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { versionKey: false },
  { timestamps: true },
);

ProjectSchema.virtual('users', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
});
ProjectSchema.virtual('releases', {
  ref: 'Release',
  localField: 'releaseId',
  foreignField: '_id',
});


module.exports = mongoose.model('project', ProjectSchema);
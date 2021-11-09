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
      unique: true,
    },
    projectData: {
      type: String,
      required: false,
    },
    releaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Release',
    },
  },
  { timestamps: true },
  { versionKey: false },
);

/* ProjectSchema.virtual('users', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
});
ProjectSchema.virtual('releases', {
  ref: 'Release',
  localField: 'releaseId',
  foreignField: '_id',
}); */

module.exports = mongoose.model('project', ProjectSchema);
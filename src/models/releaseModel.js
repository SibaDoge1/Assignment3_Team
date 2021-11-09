const mongoose = require('mongoose');
const { Schema } = require('mongoose');

// const User = require('./userModel.js');
// const Project = require('./projectModel.js');

const ReleaseSchema = new mongoose.Schema({
	projectName: {
		type: String,
		required: true,
	},
	projectData: {
		type: String,
		required: true
	},
	count: {
		type: Number,
		default: 0
	},
	authorId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	projectId: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	}
}, { timestamps: true, versionKey: false });

ReleaseSchema.virtual('authors', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
});

module.exports = mongoose.model("Release", ReleaseSchema);
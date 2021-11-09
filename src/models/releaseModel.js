const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const User = require('./userModel.js');
const Like = require('./likeModel');
const Project = require('./projectModel.js');

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
	authorName: {
		type: String,
		required: true
	},
	projectId: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	}
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true } });

ReleaseSchema.virtual('userInfo', {
	ref: 'User',
	localField: 'authorId',
	foreignField: '_id'
});

ReleaseSchema.virtual('likes', {
	ref: 'Like',
	localField: '_id', // Of post collection
	foreignField: 'releaseId',
	count:true
})

module.exports = mongoose.model("Release", ReleaseSchema);
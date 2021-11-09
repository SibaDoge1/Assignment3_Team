const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const User = require('./userModel.js');
const Release = require('./releaseModel.js');

const LikeSchema = new mongoose.Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        releaseId: {
            type: Schema.Types.ObjectId,
            ref: 'Release',
            required: true
        }
    }, { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Like", LikeSchema);
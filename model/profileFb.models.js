var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        postID:{ type: String, default: null },
        postUrl: { type: String, default: null },
        url: { type: String, default: null },
        name: { type: String, default: null },
        nickname: { type: String, default: null },
        gender: { type: String, default: null },
        birthday: { type: String, default: null },
        homeTown: { type: String, default: null },
        currentTown: { type: String, default: null },
        currentJob:{ type: String, default: null },
        Education: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProfileFB", schema, "ProfileFB");
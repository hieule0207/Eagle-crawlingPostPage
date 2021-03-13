var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        url: { type: String, default: null },
        name: { type: String, default: null },
        postsCount: { type: String, default: null },
        followersCount: { type: String, default: null },
        followingsCount: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", schema, "Profile");
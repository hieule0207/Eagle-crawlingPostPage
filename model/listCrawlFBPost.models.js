var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        postID: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("listCrawlFBPost", schema, "listCrawlFBPost");
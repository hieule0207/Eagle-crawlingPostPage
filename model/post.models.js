var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        url: { type: String, default: null },
        name: { type: String, default: null },
        reactCount: { type: String, default: null },
        releaseDate: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", schema, "Post");
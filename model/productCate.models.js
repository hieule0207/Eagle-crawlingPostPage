var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        tenLoaiSP: { type: String, default: null },
        moTaNgan: { type: String, default: null },
        trangThai: { type: Number, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProductCate", schema, "ProductCate");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        email: { type: String, default: null },
        addProduct: { type: Boolean, default: false },
        editProduct: { type: Boolean, default: false },
        checkListProduct: { type: Boolean, default: true },
        deleteProduct: { type: Boolean, default: false },
        addProductCat: { type: Boolean, default: false },
        editProductCat: { type: Boolean, default: false },
        checkListProductCat: { type: Boolean, default: true },
        deleteProductCat: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Permission", schema, "Permission");
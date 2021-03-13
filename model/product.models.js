var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
    {
        maSP: { type: Number, default: null },
        tenSP: { type: String, default: null },
        loaiSP: { type: String, default: null },
        soLuongNhapKho: { type: Number, default: null },
        soLuongTon: { type: Number, default: null },
        anhDaiDien: { type: String, default: null },
        mauSac: { type: String, default: null },
        giaTienNhap: { type: String, default: null },
        giaTienBan: { type: String, default: null },
        loaiKhuyenMai: { type: String, default: null },
        giaTriKhuyenMai: { type: Number, default: null },
        giaTienSauKhuyenMai: { type: Number, default: null },
        doanhThu: { type: Number, default: null },
        moTaNgan: { type: String, default: null },
        trangThai: { type: Number, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", schema, "Product");
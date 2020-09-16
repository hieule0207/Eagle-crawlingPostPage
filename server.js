const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const path = require("path");

app.set('view engine', 'ejs')
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => { console.log(`App listening at http://localhost:${port}`) });
// Connect with MongoDB
const MONGODB_URI =
    "mongodb://localhost:27017/Crawling";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose conection error:" + err);
});

mongoose.connection.once("open", () => {
    console.log("MongoDB connected!");
});

// enable CORS
app.use(cors());

// Make sure you place body-parser before your CRUD handlers!
app.use(
    bodyParser.urlencoded({
        parameterLimit: 10000, // 413 Payload Too Large
        limit: "50mb", // Fixed 413 Payload Too Large
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(morgan("dev"));

// public images
// app.use("/uploads/cntt", express.static(path.join(__dirname, "uploads/cntt")));

app.use("/", require("./api/api"));

app.get("/", (req, res) => {
    res.send("Back end API");
});



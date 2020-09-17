const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const app = express();
const morgan = require("morgan");
const path = require("path");
const flash = require('req-flash');
const session = require('express-session');
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
app.use(session({ secret: '123' }));
app.use(flash());
// public images
// app.use("/uploads/cntt", express.static(path.join(__dirname, "uploads/cntt")));
//============firebase================================
// var firebase = require("firebase/app");
// require("firebase/auth");

// var firebaseConfig = {
//     apiKey: "AIzaSyBqIy85m7AHKDKvSBUbQvJM8KJnzE73yU8",
//     authDomain: "aweaglecrawlingtools-1a3a8.firebaseapp.com",
//     databaseURL: "https://aweaglecrawlingtools-1a3a8.firebaseio.com",
//     projectId: "aweaglecrawlingtools-1a3a8",
//     storageBucket: "aweaglecrawlingtools-1a3a8.appspot.com",
//     messagingSenderId: "809928933659",
//     appId: "1:809928933659:web:12e21a120581a7760653be",
//     measurementId: "G-MDDFLGRRQS"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.analytics();
//====================================================
app.use("/", require("./api/api"));

app.get("/", (req, res) => {
    res.send("Back end API");
});



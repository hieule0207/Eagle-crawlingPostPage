const router = require("express").Router();
//============firebase================================
var firebase = require("firebase/app");
require("firebase/auth");

var firebaseConfig = {
    apiKey: "AIzaSyBqIy85m7AHKDKvSBUbQvJM8KJnzE73yU8",
    authDomain: "aweaglecrawlingtools-1a3a8.firebaseapp.com",
    databaseURL: "https://aweaglecrawlingtools-1a3a8.firebaseio.com",
    projectId: "aweaglecrawlingtools-1a3a8",
    storageBucket: "aweaglecrawlingtools-1a3a8.appspot.com",
    messagingSenderId: "809928933659",
    appId: "1:809928933659:web:12e21a120581a7760653be",
    measurementId: "G-MDDFLGRRQS"
};
function isAuthenticated(req, res, next) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            req.body.loginState = true;
            next();
        } else {
            // User is signed out.
            req.body.loginState = false;
            next();
            // ...
        }
    });
}
function isLogin(req, res, next) {
    console.log("join 1");
    console.log(req.body)
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
        // Handle Errors here.
        req.body.loginErr = error.message;
        req.body.isLogin = false;
        next();
        // ...
    });
    next();
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//====================================================
//=======dashboard====================================
router.get('/index', isAuthenticated, (req, res) => {
    console.log(req.body.loginState)
    if (req.body.loginState == true) {
        res.render('index.ejs', { title: "Eagle Dashboard" })
    } else {
        res.redirect('/crawling/login')
    }
});
//=======crawling=====================================
router.get('/crawl', async (req, res) => {
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
});
router.post('/crawl', async (req, res) => {
    console.log(req.body)
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
});
//========login=======================================
router.get('/login', async (req, res) => {
    res.render('login.ejs', { title: "Eagle Dashboard" })
});
router.post('/login', isLogin, async (req, res) => {
    console.log("join")
    console.log(req.body.isLogin)
    if (req.body.isLogin) {
        if (req.body.isLogin == false) {
            errMess = req.body.loginErr;
            res.render('login.ejs', { title: "Eagle Dashboard", errMess: errMess })
        }
    }
    res.redirect('/crawling/index')
});
//=======register=====================================
router.get('/register', async (req, res) => {
    res.render('register.ejs', { title: "Eagle Dashboard" })
});
router.post('/register', async (req, res) => {
    console.log(req.body);
    var message;
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
        var errorCode = error.code;
        message = error.message;
    });
    res.render('register.ejs', { title: "Eagle Dashboard" })
});
// function isAuthenticated(req, res, next) {
//     var user = firebase.auth().currentUser;
//     console.log(user)
//     if (user !== null) {
//         req.user = user;
//         next();
//     } else {
//         res.send('/login');
//     }
// }
module.exports = router;
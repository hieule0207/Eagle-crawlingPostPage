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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// var provider = new firebase.auth.GoogleAuthProvider();
//  provider.addScope(‘profile’);
//  provider.addScope(‘email’);
//  provider.addScope(‘https://www.googleapis.com/auth/plus.me');

function isAuthenticated(req, res, next) {
    var user = firebase.auth().currentUser;
    if (user !== null) {
        req.user = user;
        next();
    } else {
        res.redirect('/crawling/login');
    }
}
function doLogin(req, res, next) {
    console.log(req.body)
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then((result) => {
        req.user = result.user;
        return next();
    }).catch(function (error) {
        // Handle Errors here.
        req.body.loginErr = error.message;
        return next();
        // ...
    });
}
// function doLoginGG(req, res, next) {
//     firebase.auth().signInWithPopup(ggProvider).then(function (result) {
//         var token = result.credential.accessToken;
//         req.user = result.user;
//         req.body.isLogin == true;
//         next();
//     }).catch(function (error) {
//         console.error('Error: hande error here>>>', error.code)
//     })
// }
// //====================================================
//=======dashboard====================================
router.get('/index', isAuthenticated, async (req, res) => {
    await res.render('index.ejs', { title: "Eagle Dashboard", user: req.user.email })
});
//=======crawling=====================================
router.get('/crawl', isAuthenticated, async (req, res) => {
    console.log(req.body.loginState)
    if (req.body.loginState == true) {
        res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
    } else {
        res.redirect('/crawling/login')
    }
});
router.post('/crawl', async (req, res) => {
    console.log(req.body)
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard" })
});
//========login=======================================
router.get('/login', async (req, res) => {
    res.render('login.ejs', { title: "Eagle Dashboard" })
});
router.post('/login', doLogin, async (req, res) => {
    if (req.user) {
        return res.redirect('/crawling/index')
    } else {
        return res.render('login.ejs', { title: "Eagle Dashboard" });
    }
});
// router.post('/loginviagg', doLoginGG, async (req, res) => {
//     if (req.body.isLogin) {
//         if (req.body.isLogin == false) {
//             res.render('login.ejs', { title: "Eagle Dashboard" })
//         }
//     }
//     return res.redirect('/crawling/index');
// });
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
});//==========signout=================================
router.post('/logout', async (req, res) => {
    firebase.auth().signOut()
        .catch(function (err) {
            // Handle errors
            console.error(err)
        });
    return res.redirect('/crawling/login')
});
module.exports = router;
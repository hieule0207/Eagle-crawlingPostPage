const router = require("express").Router();
const puppeteer = require('puppeteer');
const multer = require('multer')
const fs = require("fs");
const Profile = require("../model/Profile.models");
const Post = require("../model/post.models");
const ProfileFB = require("../model/profileFb.models");
const listCrawlFBPost = require("../model/listCrawlFBPost.models");
const Product = require("../model/product.models");
const ProductCate = require("../model/productCate.models");
const Permission = require("../model/permission.models");
const FILE_PATH = "public/img";

let Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, FILE_PATH);
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-viss-${file.originalname}`;
        console.log(filename)
        callback(null, filename);
    }
});
var upload = multer({
    storage: Storage
})
function uploadPhotos(req, res, next) {
    upload.single("avatar")(req, res, function (error) {
        try {
            console.log("run uploadPhotos");
            const photos = req.file;
            // console.log(photos);
            // console.log(req.file);
            // check if photos are available
            if (!photos) {
                console.log("no photo");
                next();
            } else {
                req.body.uploads = photos;
                next();
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });
}
// #endregion
//============firebase================================
var firebase = require("firebase/app");
require("firebase/auth");

var firebaseConfig = {
    apiKey: "AIzaSyDHAht_-NayVlamsVqcz7kEP1S6oOycb-g",
    authDomain: "aweagle-crawlingproject.firebaseapp.com",
    databaseURL: "https://aweagle-crawlingproject.firebaseio.com",
    projectId: "aweagle-crawlingproject",
    storageBucket: "aweagle-crawlingproject.appspot.com",
    messagingSenderId: "269903731818",
    appId: "1:269903731818:web:880935fdb29fd0f9b37e13",
    measurementId: "G-7ZTEP0NXJG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// var provider = new firebase.auth.GoogleAuthProvider();
//  provider.addScope(‘profile’);
//  provider.addScope(‘email’);
//  provider.addScope(‘https://www.googleapis.com/auth/plus.me');
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
//=======register=====================================
router.get('/register', async (req, res) => {
    res.render('register.ejs', { title: "Eagle Dashboard" })
});
router.post('/register', async (req, res) => {
    console.log(req.body);
    var message;
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then(() => {
        res.redirect('/crawling/login');
        var newAccount = new Permission({
            email: req.body.email,
            addProduct: false,
            editProduct: false,
            checkListProduct: false,
            deleteProduct: false,
            addProductCat: false,
            editProductCat: false,
            checkListProductCat: false,
            deleteProductCat: false,
        });
        newAccount.save((err) => {
            if (err) {
                console.log(err)
                return next(err)
            }
        });
    }).catch(function (error) {
        var errorCode = error.code;
        message = error.message;
        console.log(message)
    });
});//==========signout=================================
router.post('/logout', async (req, res) => {
    firebase.auth().signOut()
        .catch(function (err) {
            // Handle errors
            console.error(err)
        });
    return res.redirect('/crawling/login')
});
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
        console.log(error.message)
        return next();
        // ...
    });
}
//=======dashboard====================================
router.get('/index', isAuthenticated, async (req, res) => {
    await res.render('index.ejs', { title: "Eagle Dashboard", user: req.user.email })
});
//=======crawling=====================================
router.get('/crawl', isAuthenticated, async (req, res) => {
    res.render('crawlingForm.ejs', { title: "Eagle Dashboard", user: req.user.email })
});
router.post('/crawl', isAuthenticated, async (req, res) => {
    console.log(req.body);
    if (req.body.platform == 'FB') {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const context = browser.defaultBrowserContext();
            context.overridePermissions("https://www.facebook.com", ["geolocation", "notifications"]);
            const page = await browser.newPage();
            // await page.setDefaultNavigationTimeout(0); 
            await page.setViewport({
                width: 1280,
                height: 500
            });
            try {
                await page.goto('https://www.facebook.com/');
                const usernameBox = await page.$('#email');
                await usernameBox.type('hieule0207@gmail.com');

                const passwordBox = await page.$('#pass');
                await passwordBox.type('tpg123!@#');

                const loginButton = await page.$('#u_0_b');
                await loginButton.press('Enter');
                await page.waitForNavigation();
                //page
                await page.goto(req.body.url, { waitUntil: 'networkidle2' });
                let post = {};
                post.content = await page.$eval('.ecm0bbzt.hv4rvrfc.ihqw7lf3.dati1w0a', element => element.innerText);
                post.reactionsCount = await page.$eval('.pcp91wgn', element => element.innerText);
                post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)', element => element.innerText);
                post.sharesCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(2)', element => element.innerText);
                console.log(post);
                await page.click('.pcp91wgn', { waitUntil: 'load' });
                setTimeout(async function () {

                    await page.waitForSelector('.j83agx80.cbu4d94t.buofh1pr > div');
                    // await page.waitForSelector('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m');
                    // await page.waitForSelector('.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m');
                    const user = await page.evaluate(() => {
                        // let _user = document.querySelectorAll('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m a');
                        let _user = document.querySelectorAll('.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d3f4x2em.fe6kdd0r.mau55g9w.c8b282yb.iv3no6db.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m a');
                        console.log("_user1" + _user);
                        _user = [..._user];
                        let user = [];
                        for (var i = 0; i < _user.length; i++) {
                            const name = _user[i].innerText;
                            const url = _user[i].getAttribute('href');
                            user.push({
                                name,
                                url,
                            });
                            console.log(user)
                        }
                        console.log(user)
                        return user
                    })
                    console.log(user);
                    // //end page
                    let _profile = [];
                    let postUrl = req.body.url;
                    let postID = postUrl + '-fb-' + Date.now();
                    var _listCrawlFBPost = new listCrawlFBPost({
                        postID: postID,
                    });
                    _listCrawlFBPost.save((err) => {
                        if (err) {
                            console.log(err)
                        }
                    });
                    for (var i = 0; i < user.length; i++) {
                        let tempUrl = user[i].url;
                        let temp = tempUrl.indexOf("__cft__") - 1;
                        let url = tempUrl.slice(0, temp);
                        console.log(url);
                        if (url.search("id=") != -1) {
                            const ProfilePage = await browser.newPage();
                            await ProfilePage.goto(url, { waitUntil: 'networkidle2' });
                            const name = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('.gmql0nx0.l94mrbxd.p1ri9a11.lzcic4wl.bp9cbjyn.j83agx80');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const nickname = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('.m6dqt4wy.knj5qynh.h676nmdw');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            let contactAndBasicsUrl = url + '&sk=about_contact_and_basic_info';
                            await ProfilePage.goto(contactAndBasicsUrl, { waitUntil: 'networkidle2' });
                            const gender = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(2)');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const birthday = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(3)');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            let aboutPlacesUrl = url + '&sk=about_places';
                            await ProfilePage.goto(aboutPlacesUrl, { waitUntil: 'networkidle2' });
                            const homeTown = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.oygrvhab');
                                if (element)
                                    return element.innerText;
                                const element2 = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div > div:nth-child(3)');
                                if (element2)
                                    return element2.innerText;
                                return '';
                            });
                            const currentTown = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.c9zspvje');
                                if (element)
                                    return element.innerText;
                                const element2 = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div > div:nth-child(2)');
                                if (element2)
                                    return element2.innerText;
                                return '';
                            });
                            let aboutWorkAndEducation = url + '&sk=about_work_and_education';
                            await ProfilePage.goto(aboutWorkAndEducation, { waitUntil: 'networkidle2' });
                            const currentJob = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(1) div.c9zspvje');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const Education = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(2) > div.oygrvhab');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            _profile.push({
                                postID,
                                postUrl,
                                url,
                                name,
                                nickname,
                                gender,
                                birthday,
                                homeTown,
                                currentTown,
                                currentJob,
                                Education
                            });
                            var _profileFB = new ProfileFB({
                                postID: postID,
                                urlPost: postUrl,
                                url: url,
                                name: name,
                                nickname: nickname,
                                gender: gender,
                                birthday: birthday,
                                homeTown: homeTown,
                                currentTown: currentTown,
                                currentJob: currentJob,
                                Education: Education,
                            });
                            _profileFB.save((err) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log('ok')
                            });
                            await ProfilePage.close();
                        } else {
                            const ProfilePage = await browser.newPage();
                            await ProfilePage.goto(url, { waitUntil: 'networkidle2' });
                            const name = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('.gmql0nx0.l94mrbxd.p1ri9a11.lzcic4wl.bp9cbjyn.j83agx80');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const nickname = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('.m6dqt4wy.knj5qynh.h676nmdw');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            let contactAndBasicsUrl = url + '/about_contact_and_basic_info';
                            await ProfilePage.goto(contactAndBasicsUrl, { waitUntil: 'networkidle2' });
                            const gender = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(2)');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const birthday = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(3)');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            let aboutPlacesUrl = url + '/about_places';
                            await ProfilePage.goto(aboutPlacesUrl, { waitUntil: 'networkidle2' });
                            const homeTown = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.oygrvhab');
                                if (element)
                                    return element.innerText;
                                const element2 = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div > div:nth-child(3)');
                                if (element2)
                                    return element2.innerText;
                                return '';
                            });
                            const currentTown = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.c9zspvje');
                                if (element)
                                    return element.innerText;
                                const element2 = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div > div:nth-child(2)');
                                if (element2)
                                    return element2.innerText;
                                return '';
                            });
                            let aboutWorkAndEducation = url + '/about_work_and_education';
                            await ProfilePage.goto(aboutWorkAndEducation, { waitUntil: 'networkidle2' });
                            const currentJob = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(1) div.c9zspvje');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            const Education = await ProfilePage.evaluate(() => {
                                const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(2) > div.oygrvhab');
                                if (element)
                                    return element.innerText;
                                return '';
                            });
                            _profile.push({
                                postID,
                                postUrl,
                                url,
                                name,
                                nickname,
                                gender,
                                birthday,
                                homeTown,
                                currentTown,
                                currentJob,
                                Education
                            });
                            var _profileFB = new ProfileFB({
                                postID: postID,
                                urlPost: postUrl,
                                url: url,
                                name: name,
                                nickname: nickname,
                                gender: gender,
                                birthday: birthday,
                                homeTown: homeTown,
                                currentTown: currentTown,
                                currentJob: currentJob,
                                Education: Education,
                            });
                            _profileFB.save((err) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log("ok")
                            });
                            await ProfilePage.close();
                        }
                    };
                    fs.writeFileSync(req.body.filename + '.json', JSON.stringify(_profile))
                }, 30000);
            } catch (err) {
                console.log(err);
            }
        })();
        res.render('crawlingForm.ejs', { title: "Eagle Dashboard", user: req.user.email })
    } else {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const context = browser.defaultBrowserContext();
            context.overridePermissions("https://www.instagram.com", ["geolocation", "notifications"]);
            const page = await browser.newPage();
            // await page.setDefaultNavigationTimeout(0); 
            await page.setViewport({
                width: 1440,
                height: 1000
            });
            ///==========login method================================================================
            await page.goto('https://www.instagram.com');
            await page.waitFor('input[name=username]');
            await page.type('input[name=username]', 'hieule.0207');
            await page.type('input[name=password]', 'tpg123!@#');
            const loginButton = await page.$('.sqdOP.L3NKy.y3zKF');
            await loginButton.press('Enter');
            await page.waitForNavigation();
            ///=============go to profile ==============================================================
            await page.goto(req.body.url, { waitUntil: 'networkidle2' });
            ///======post list================================
            try {
                ///==========load more post===================
                page.evaluate(() => {
                    // document.querySelector('.ySN3v > div > div > div:nth-child(8)').scrollIntoView();
                    window.scrollTo(0, 1500);
                })
                ///===========execute==========================
                setTimeout(async function () {
                    const postsList = await page.evaluate(() => {
                        let _post = document.querySelectorAll('div.v1Nh3.kIKUG._bz0w a');
                        _post = [..._post];
                        let post = [];
                        for (var i = 0; i < _post.length; i++) {
                            const number = i;
                            const url = _post[i].getAttribute('href');
                            post.push({
                                number,
                                url,
                            });
                            console.log(post)
                        }
                        console.log(post)
                        return post
                    })
                    console.log(postsList);
                    ///======go to post and get the release date, list hashtag================================
                    let _profile = [];
                    for (var i = 0; i < postsList.length; i++) {
                        let url = postsList[i].url;
                        console.log(url);
                        const postPage = await browser.newPage();
                        await postPage.goto('https://www.instagram.com' + url, { waitUntil: 'networkidle2' });
                        const releaseDate = await postPage.evaluate(() => {
                            const element = document.querySelector('a.c-Yi7 time');
                            if (element)
                                return element.getAttribute('datetime');
                            return '';
                        });
                        const reactionCount = await postPage.evaluate(() => {
                            const element = document.querySelector('button.sqdOP.yWX7d._8A5w5 span');
                            if (element)
                                return element.innerText;
                            return '';
                        });
                        const location = await postPage.evaluate(() => {
                            const element = document.querySelector('a.O4GlU');
                            if (element)
                                return element.innerText;
                            return '';
                        });
                        const hashtag = await postPage.evaluate(() => {
                            let _hashtag = document.querySelectorAll('a.xil3i');
                            _hashtag = [..._hashtag];
                            console.log(_hashtag);
                            let hashtag = [];
                            for (var i = 0; i < _hashtag.length; i++) {
                                const tag = _hashtag[i].innerText;
                                hashtag.push(
                                    tag
                                );
                            }
                            return hashtag
                        })
                        _profile.push({
                            url,
                            releaseDate,
                            reactionCount,
                            location,
                            hashtag,
                        });
                        await postPage.close();
                    }
                    console.log(_profile);
                    fs.writeFileSync(req.body.filename + '.json', JSON.stringify(_profile))
                }, 10000);
            }
            catch (e) { console.log(e) }
        })();
        res.render('crawlingForm.ejs', { title: "Eagle Dashboard", user: req.user.email })
    }
});
router.get('/crawl-data', isAuthenticated, async (req, res) => {
    await listCrawlFBPost.find((err, listPost) => {
        if (err) {
            console.log(err)
        }
        res.render('crawlingFBData.ejs', { title: "Eagle Dashboard", user: req.user.email, list: null, listPost: listPost })
    });
});
router.post('/crawl-data', isAuthenticated, async (req, res) => {
    console.log(req.body.postID);
    try {
        await listCrawlFBPost.find((err, listPost) => {
            if (err) {
                console.log(err)
            }
            _listPost = listPost;
        });
        await ProfileFB.find({ postID: req.body.postID }, (err, list) => {
            if (err) {
                console.log(err)
            }
            _list = list
        });
        res.render('crawlingFBData.ejs', { title: "Eagle Dashboard", user: req.user.email, listPost: _listPost, list: _list })
    } catch (e) { console.log(e) }
});
///=======tracking follower===========================
router.get('/tracking', isAuthenticated, async (req, res) => {
    res.render('trackingForm.ejs', { title: "Eagle Dashboard", user: req.user.email, data: null })
});
router.post('/tracking', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.instagram.com", ["geolocation", "notifications"]);
    const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0); 
    await page.setViewport({
        width: 1280,
        height: 500
    });
    ///==========login method================================================================
    await page.goto('https://www.instagram.com');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', 'hieule.0207');
    await page.type('input[name=password]', 'tpg123!@#');
    const loginButton = await page.$('.sqdOP.L3NKy.y3zKF');
    await loginButton.press('Enter');
    await page.waitForNavigation();
    ///=============go to profile page========================================================
    try {
        await page.goto(req.body.url, { waitUntil: 'networkidle2' });
        const url = req.body.url;
        const nickname = await page.evaluate(() => {
            const element = document.querySelector('._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl');
            if (element)
                return element.innerText;
            return '';
        });
        const postCounter = await page.evaluate(() => {
            const element = document.querySelector('.k9GMp > li:nth-child(1) > span > span');
            if (element)
                return element.innerText;
            return '';
        });
        const followByUserCounter = await page.evaluate(() => {
            const element = document.querySelector('.k9GMp > li:nth-child(2) > a > span');
            const element2 = document.querySelector('.k9GMp > li:nth-child(2) > span > span');
            if (element) {
                return element.innerText;
            } else if (element2) {
                return element2.innerText;
            }
            return '';
        });
        const followUserCounter = await page.evaluate(() => {
            const element = document.querySelector('.k9GMp > li:nth-child(3) > a > span');
            const element2 = document.querySelector('.k9GMp > li:nth-child(3) > span > span');
            if (element) {
                return element.innerText;
            } else if (element2) {
                return element2.innerText;
            }
            return '';
        });
        var _profile = new Profile({
            url: url,
            name: nickname,
            postsCount: postCounter,
            followersCount: followByUserCounter,
            followingsCount: followUserCounter,
        });
        _profile.save((err) => {
            if (err) { console.log(err); }
        });
        console.log(_profile);
        await page.close();
    }
    catch (e) { console.log(e) };
    var data;
    Profile.find({ url: req.body.url }, (err, docs) => {
        if (!err) {
            data = docs;
            res.render('trackingForm.ejs', { title: "Eagle Dashboard", user: req.user.email, data: data })
        } else {
            console.log(err)
        }
    });
});
///=======tracking post's reaction===========================
router.get('/tracking-post', isAuthenticated, async (req, res) => {
    res.render('trackingPostForm.ejs', { title: "Eagle Dashboard", user: req.user.email, data: null })
});
router.post('/tracking-post', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.instagram.com", ["geolocation", "notifications"]);
    const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0); 
    await page.setViewport({
        width: 1280,
        height: 500
    });
    ///==========login method================================================================
    await page.goto('https://www.instagram.com');
    await page.waitFor('input[name=username]');
    await page.type('input[name=username]', 'hieule.0207');
    await page.type('input[name=password]', 'tpg123!@#');
    const loginButton = await page.$('.sqdOP.L3NKy.y3zKF');
    await loginButton.press('Enter');
    await page.waitForNavigation();
    ///=============go to post page========================================================
    await page.goto(req.body.url, { waitUntil: 'networkidle2' });
    try {
        let post = {};
        post.name = await page.evaluate(() => {
            const element = document.querySelector('div.e1e1d span a');
            if (element)
                return element.innerText;
            return '';
        });
        post.reaction = await page.evaluate(() => {
            const element = document.querySelector('div.Nm9Fw button span');
            if (element)
                return element.innerText;
            return '';
        });
        post.releaseDate = await page.evaluate(() => {
            const element = document.querySelector('a.c-Yi7 time');
            if (element)
                return element.getAttribute('datetime');
            return '';
        });
        console.log(post)
        var _post = new Post({
            url: req.body.url,
            name: post.name,
            reactCount: post.reaction,
            releaseDate: post.releaseDate,
        });
        _post.save((err) => {
            if (err) { console.log(err); }
        });
        console.log(_post);
        await browser.close();
    }
    catch (e) { console.log(e) };
    var data;
    Post.find({ url: req.body.url }, (err, docs) => {
        if (!err) {
            data = docs;
            res.render('trackingPostForm.ejs', { title: "Eagle Dashboard", user: req.user.email, data: data })
        } else {
            console.log(err)
        }
    });
});
//********************************************************************************Product*********************************************************/
//========product-add=======================================
router.get('/product-add', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].addProduct)
        if (getPermission[0].addProduct == true) {
            let data = {};
            await ProductCate.find((err, docs2) => {
                if (!err) {
                    data.cate = docs2;
                }
            });
            res.render('addProductForm.ejs', { data: data, title: "Thêm Sản phẩm mới", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
router.post('/product-add', isAuthenticated, uploadPhotos, productAdd)
async function productAdd(req, res, next) {
    console.log(req.body);
    let newMaSP
    let oldMaSP = await Product.find().sort({ maSP: -1 }).limit(1);
    if (oldMaSP.length < 1) {
        console.log("First Product")
        newMaSP = 1
    } else {
        let temp = oldMaSP[0].maSP;
        newMaSP = parseInt(temp, 10) + 1;
    }
    try {
        if (!req.body.uploads) {
            if (req.body.loaiKhuyenMai == "khongKhuyenMai") {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: null,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: null,
                    giaTriKhuyenMai: null,
                    giaTienSauKhuyenMai: req.body.giaTienBan,
                    doanhThu: req.body.giaTienBan - req.body.giaTienNhap,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            } else if (req.body.loaiKhuyenMai == "salesAmount") {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: null,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: req.body.loaiKhuyenMai,
                    giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                    giaTienSauKhuyenMai: req.body.giaTienBan - req.body.giaTriKhuyenMai,
                    doanhThu: (req.body.giaTienBan - req.body.giaTienNhap) - req.body.giaTriKhuyenMai,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            } else {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: null,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: req.body.loaiKhuyenMai,
                    giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                    giaTienSauKhuyenMai: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100),
                    doanhThu: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100) - req.body.giaTienNhap,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            }
        } else {
            if (req.body.loaiKhuyenMai == "khongKhuyenMai") {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: "img/" + req.body.uploads.filename,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: null,
                    giaTriKhuyenMai: null,
                    giaTienSauKhuyenMai: req.body.giaTienBan,
                    doanhThu: req.body.giaTienBan - req.body.giaTienNhap,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            } else if (req.body.loaiKhuyenMai == "salesAmount") {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: "img/" + req.body.uploads.filename,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: req.body.loaiKhuyenMai,
                    giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                    giaTienSauKhuyenMai: req.body.giaTienBan - req.body.giaTriKhuyenMai,
                    doanhThu: (req.body.giaTienBan - req.body.giaTienNhap) - req.body.giaTriKhuyenMai,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            } else {
                var productData = new Product({
                    maSP: newMaSP,
                    tenSP: req.body.tenSP,
                    loaiSP: req.body.loaiSP,
                    soLuongNhapKho: req.body.soLuongNhapKho,
                    soLuongTon: req.body.soLuongTon,
                    anhDaiDien: "img/" + req.body.uploads.filename,
                    mauSac: req.body.mauSac,
                    giaTienNhap: req.body.giaTienNhap,
                    giaTienBan: req.body.giaTienBan,
                    loaiKhuyenMai: req.body.loaiKhuyenMai,
                    giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                    giaTienSauKhuyenMai: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100),
                    doanhThu: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100) - req.body.giaTienNhap,
                    moTaNgan: req.body.moTaNgan,
                    trangThai: 1
                });
                productData.save((err) => {
                    if (err) {
                        console.log(err)
                        return next(err)
                    } else {
                        res.redirect("/crawling/product-list");
                    }
                });
            }
        }
    } catch (error) {
        res.json({ message: "Thêm thất bại", error: error });
    }
}
//========product-list=======================================
router.get('/product-list', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].checkListProduct)
        if (getPermission[0].checkListProduct == true) {
            let list = {};
            await Product.find((err, docs) => {
                if (!err) {
                    list = docs;
                }
            });
            res.render('productListForm.ejs', { list: list, title: "Danh sách sản phẩm", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/product-list-price', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].checkListProduct)
        if (getPermission[0].checkListProduct == true) {
            let list = {};
            await Product.find((err, docs) => {
                if (!err) {
                    list = docs;
                }
            });
            res.render('productListPriceForm.ejs', { list: list, title: "Danh sách sản phẩm", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
router.get('/product-list-warehouse', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].checkListProduct)
        if (getPermission[0].checkListProduct == true) {
            let list = {};
            await Product.find((err, docs) => {
                if (!err) {
                    list = docs;
                }
            });
            res.render('productListWarehouseForm.ejs', { list: list, title: "Danh sách sản phẩm", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
//========product-single-edit=======================================
async function productEdit(req, res) {
    console.log(req.body)
    try {
        if (!req.body.uploads) {
            if (req.body.loaiKhuyenMai == "khongKhuyenMai") {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: null,
                        giaTriKhuyenMai: null,
                        giaTienSauKhuyenMai: req.body.giaTienBan,
                        doanhThu: req.body.giaTienBan - req.body.giaTienNhap,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            } else if (req.body.loaiKhuyenMai == "salesAmount") {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: req.body.loaiKhuyenMai,
                        giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                        giaTienSauKhuyenMai: req.body.giaTienBan - req.body.giaTriKhuyenMai,
                        doanhThu: (req.body.giaTienBan - req.body.giaTienNhap) - req.body.giaTriKhuyenMai,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            } else {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: req.body.loaiKhuyenMai,
                        giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                        giaTienSauKhuyenMai: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100),
                        doanhThu: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100) - req.body.giaTienNhap,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            }
        } else {
            if (req.body.loaiKhuyenMai == "khongKhuyenMai") {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        anhDaiDien: "img/" + req.body.uploads.filename,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: null,
                        giaTriKhuyenMai: null,
                        giaTienSauKhuyenMai: req.body.giaTienBan,
                        doanhThu: req.body.giaTienBan - req.body.giaTienNhap,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            } else if (req.body.loaiKhuyenMai == "salesAmount") {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        anhDaiDien: "img/" + req.body.uploads.filename,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: req.body.loaiKhuyenMai,
                        giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                        giaTienSauKhuyenMai: req.body.giaTienBan - req.body.giaTriKhuyenMai,
                        doanhThu: (req.body.giaTienBan - req.body.giaTienNhap) - req.body.giaTriKhuyenMai,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            } else {
                await Product.findOneAndUpdate(
                    { _id: req.body._id },
                    {
                        tenSP: req.body.tenSP,
                        loaiSP: req.body.loaiSP,
                        soLuongNhapKho: req.body.soLuongNhapKho,
                        soLuongTon: req.body.soLuongTon,
                        anhDaiDien: "img/" + req.body.uploads.filename,
                        mauSac: req.body.mauSac,
                        giaTienNhap: req.body.giaTienNhap,
                        giaTienBan: req.body.giaTienBan,
                        loaiKhuyenMai: req.body.loaiKhuyenMai,
                        giaTriKhuyenMai: req.body.giaTriKhuyenMai,
                        giaTienSauKhuyenMai: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100),
                        doanhThu: (req.body.giaTienBan * req.body.giaTriKhuyenMai / 100) - req.body.giaTienNhap,
                        moTaNgan: req.body.moTaNgan,
                        trangThai: req.body.trangThai,
                    }
                );
                res.redirect("/crawling/product-list");
            }
        }
    } catch (error) {
        res.json({ message: "Chỉnh sửa thất bại", error: error });
    }
}
router.get('/product-edit/:id', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].editProduct)
        if (getPermission[0].editProduct == true) {
            var product = await Product.findById(req.params.id);
            var cate = await ProductCate.find();
            res.render('editProductForm.ejs', { product, cate, title: "Product", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
});
router.post("/product-edit", uploadPhotos, productEdit);
//========Delete product============================================
router.get("/product-delete/:id", isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].deleteProduct)
        if (getPermission[0].deleteProduct == true) {
            await Product.findOneAndUpdate(
                { _id: req.params.id },
                {
                    trangThai: 0,
                }
            );
            res.redirect("/crawling/product-list");
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
});
//********************************************************************************Product Category*********************************************************/
//========Add Product Cat===========================================
router.get('/product-cat-add', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].addProductCat)
        if (getPermission[0].addProductCat == true) {
            res.render('addProductCatForm.ejs', { title: "Thêm Sản phẩm mới", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
router.post('/product-cat-add', isAuthenticated, async (req, res) => {
    console.log(req.body);
    try {
        var productCatData = new ProductCate({
            tenLoaiSP: req.body.tenLoaiSP,
            moTaNgan: req.body.moTaNgan,
            trangThai: 1
        });
        productCatData.save((err) => {
            if (err) {
                console.log(err)
                return next(err)
            } else {
                // res.redirect("/crawling/product-list");
                res.render('addProductCatForm.ejs', { title: "Thêm Sản phẩm mới", user: req.user.email })
            }
        });
    } catch (error) {
        res.json({ message: "Chỉnh sửa thất bại", error: error });
    }
})
//========Product category list=====================================
router.get('/product-cat-list', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].checkListProductCat)
        if (getPermission[0].checkListProductCat == true) {
            let list = {};
            await ProductCate.find((err, docs) => {
                if (!err) {
                    list = docs;
                }
            });
            res.render('productListCatForm.ejs', { list: list, title: "Danh sách sản phẩm", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
//========Single Product Cat
router.get('/product-cat-edit/:id', isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].editProductCat)
        if (getPermission[0].editProductCat == true) {
            var productCat = await ProductCate.findById(req.params.id);
            res.render('editProductCatForm.ejs', { productCat, title: "Product", user: req.user.email })
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/product-cat-edit', isAuthenticated, async (req, res) => {
    console.log(req.body);
    try {
        await ProductCate.findOneAndUpdate(
            { _id: req.body._id },
            {
                tenLoaiSP: req.body.tenLoaiSP,
                moTaNgan: req.body.moTaNgan,
                trangThai: req.body.trangThai,
            }
        );
        res.redirect("/crawling/product-cat-list");
    } catch (error) {
        res.json({ message: "Chỉnh sửa thất bại", error: error });
    }
});
//========Product cat delete========================================
router.get("/product-cat-delete/:id", isAuthenticated, async (req, res) => {
    try {
        var getPermission = await Permission.find({ email: req.user.email });
        console.log(getPermission[0].deleteProductCat)
        if (getPermission[0].deleteProductCat == true) {
            await ProductCate.findOneAndUpdate(
                { _id: req.params.id },
                {
                    trangThai: 0,
                }
            );
            res.redirect("/crawling/product-cat-list");
        }
        else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
});
//********************************************************************************Account Permission*********************************************************/
//========Account list==============================================
router.get('/account-list', isAuthenticated, async (req, res) => {
    try {
        if (req.user.email == 'hieule0207@gmail.com') {
            let list = {};
            await Permission.find((err, docs) => {
                if (!err) {
                    list = docs;
                }
            });
            res.render('accountListForm.ejs', { list: list, title: "Danh sách sản phẩm", user: req.user.email })
        } else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
})
//========Edit permission===========================================
router.get('/account-edit/:id', isAuthenticated, async (req, res) => {
    try {
        if (req.user.email == 'hieule0207@gmail.com') {
            var Account = await Permission.findById(req.params.id);
            res.render('editPermission.ejs', { Account, title: "Product", user: req.user.email })
        } else {
            res.redirect("/crawling/index");
        }
    } catch (error) {
        console.log(error);
    }
});
router.post('/account-edit', isAuthenticated, async (req, res) => {
    console.log(req.body);
    try {
        await Permission.findOneAndUpdate(
            { _id: req.body._id },
            {
                addProduct: req.body.addProduct,
                editProduct: req.body.editProduct,
                checkListProduct: req.body.checkListProduct,
                deleteProduct: req.body.deleteProduct,
                addProductCat: req.body.addProductCat,
                editProductCat: req.body.editProductCat,
                checkListProductCat: req.body.checkListProductCat,
                deleteProductCat: req.body.deleteProductCat,
            }
        );
        res.redirect("/crawling/account-list");
    } catch (error) {
        res.json({ message: "Chỉnh sửa thất bại", error: error });
    }
});
router.get('/account-reset/:id', isAuthenticated, async (req, res) => {
    try {
        await Permission.findOneAndUpdate(
            { _id: req.params.id },
            {
                addProduct: false,
                editProduct: false,
                checkListProduct: false,
                deleteProduct: false,
                addProductCat: false,
                editProductCat: false,
                checkListProductCat: false,
                deleteProductCat: false,
            }
        );
        res.redirect("/crawling/account-list");
    } catch (error) {
        console.log(error)
    }
});
module.exports = router;
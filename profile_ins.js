const puppeteer = require('puppeteer');
const fs = require("fs");
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
    await page.goto('https://www.instagram.com/joyce.nng/', { waitUntil: 'networkidle2' });
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
            fs.writeFileSync('rawTestDataIns2.json', JSON.stringify(_profile))
        }, 10000);
    }
    catch (e) { console.log(e) }
})();


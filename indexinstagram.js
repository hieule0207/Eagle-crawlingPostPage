const puppeteer = require('puppeteer');
const fs = require("fs");
(async () => {
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
    ///=============go to post ==============================================================
    await page.goto('https://www.instagram.com/p/CFqiVVUhoSG/', { waitUntil: 'networkidle2' });
    await page.click('.Nm9Fw > button');
    ///======react list================================
    try {
        setTimeout(async function () {
            await page.waitFor('._1XyCr');
            const user = await page.evaluate(() => {
                let _user = document.querySelectorAll('span.Jv7Aj.MqpiF a');
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
            let _profile = [];
            for (var i = 0; i < user.length; i++) {
                let url = user[i].url;
                console.log(url);
                const ProfilePage = await browser.newPage();
                await ProfilePage.goto('https://www.instagram.com' + url, { waitUntil: 'networkidle2' });
                const nickname = await ProfilePage.evaluate(() => {
                    const element = document.querySelector('._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl');
                    if (element)
                        return element.innerText;
                    return '';
                });
                const postCounter = await ProfilePage.evaluate(() => {
                    const element = document.querySelector('.k9GMp > li:nth-child(1) > span > span');
                    if (element)
                        return element.innerText;
                    return '';
                });
                const followByUserCounter = await ProfilePage.evaluate(() => {
                    const element = document.querySelector('.k9GMp > li:nth-child(2) > a > span');
                    const element2 = document.querySelector('.k9GMp > li:nth-child(2) > span > span');
                    if (element) {
                        return element.innerText;
                    } else if (element2) {
                        return element2.innerText;
                    }
                    return '';
                });
                const followUserCounter = await ProfilePage.evaluate(() => {
                    const element = document.querySelector('.k9GMp > li:nth-child(3) > a > span');
                    const element2 = document.querySelector('.k9GMp > li:nth-child(3) > span > span');
                    if (element) {
                        return element.innerText;
                    } else if (element2) {
                        return element2.innerText;
                    }
                    return '';
                });
                _profile.push({
                    url,
                    nickname,
                    postCounter,
                    followByUserCounter,
                    followUserCounter,
                });
                await ProfilePage.close();
            };
            fs.writeFileSync('rawTestDataIns.json', JSON.stringify(_profile))
        }, 30000);
    }
    catch (e) { console.log(e) }
})();


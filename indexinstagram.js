const puppeteer = require('puppeteer');
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
    await page.goto('https://www.instagram.com/p/CC5dpBpDWXs', { waitUntil: 'networkidle2' });
    await page.click('.Nm9Fw > button');
    ///======react list================================
    await page.waitFor('._1XyCr');
    const user = await page.evaluate(() => {
        let _user = document.querySelectorAll('.Igw0E.rBNOH.eGOV_.ybXk5._4EzTm.XfCBB.HVWg4 > div:nth-child(1) > div:nth-child(1)');
        _user = [..._user];
        console.log(_user);
        let user = [];
        for (var i = 0; i < _user.length; i++) {
            const name = _user[i].innerHTML;
            const url = _user[i].getAttribute('href');
            user.push({
                name,
                url,
            });
        }
        return user
    })
    console.log(user);
})();
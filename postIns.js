const puppeteer = require('puppeteer');
const fs = require("fs");
(async () => {
    const browser = await puppeteer.launch({ headless: true });
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
    ///=============go to post ==============================================================
    await page.goto('https://www.instagram.com/p/CAxOmZQls4s/', { waitUntil: 'networkidle2' });
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
    }
    catch (e) { console.log(e) }
})();


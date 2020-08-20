const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.facebook.com/groups/chogaminggear2nd/permalink/1957504501054009');
    let post = {}
    post.postContent = await page.$eval('div._5pbx.userContent._3576 > p', element => element.innerHTML);
    post.reactionsCount = await page.$eval('span._81hb', element => element.innerHTML);
    post.commentsCount = await page.$eval('a._3hg-._42ft', element => element.innerHTML);
    post.sharesCount = await page.$eval('a._3rwx._42ft', element => element.innerHTML);
    console.log(post);
    await browser.close();
})();
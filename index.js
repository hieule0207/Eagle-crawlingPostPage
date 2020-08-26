const puppeteer = require('puppeteer');

// (async() => {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     await page.goto('https://www.facebook.com/groups/chogaminggear2nd/permalink/1961891970615262/');
//     let post = {}
//     post.postContent = await page.$eval('div._5pbx.userContent._3576 > p', element => element.innerHTML);
//     post.reactionsCount = await page.$eval('span._81hb', element => element.innerHTML);
//     post.commentsCount = await page.$eval('a._3hg-._42ft', element => element.innerHTML);
//     post.sharesCount = await page.$eval('a._3rwx._42ft', element => element.innerHTML);
//     console.log(post);
//     await browser.close();
// })();
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
    await page.goto('https://www.facebook.com/');
    const usernameBox = await page.$('#email');
    await usernameBox.type('hieule0207@gmail.com');

    const passwordBox = await page.$('#pass');
    await passwordBox.type('tpg123!@#');

    const loginButton = await page.$('#u_0_b');
    await loginButton.press('Enter');
    await page.waitForNavigation();
    //page
    await page.goto('https://www.facebook.com/noichaohanh/posts/168179781433735', { waitUntil: 'networkidle2' });
    let post = {}
    post.content = await page.$eval('.ecm0bbzt.hv4rvrfc.ihqw7lf3.dati1w0a', element => element.innerText);
    post.reactionsCount = await page.$eval('.pcp91wgn', element => element.innerText);
    post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)', element => element.innerText);
    post.sharesCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(2)', element => element.innerText);
    console.log(post);
    await page.click('.pcp91wgn', { waitUntil: 'load' });
    await page.waitForSelector('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m');
    // let user = {}
    // user.name = await page.$eval('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m', element => element.innerText);
    // user.url = await page.$eval('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m a', a => a.getAttribute('href'));
    const user = await page.evaluate(() => {
        let userLinks = document.querySelectorAll('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m a');
        userLinks = [...userLinks];
        let user = userLinks.map(link => ({
            name: link.innerText,
            url: link.getAttribute('href')
        }));
        return user;
    });
    console.log(user);
    //end page
    // //group
    // await page.goto('https://www.facebook.com/groups/Genshinimpact.vi/permalink/776417803092679/', {waitUntil: 'networkidle2'});
    // let post = {}
    // post.content = await page.$eval('.ecm0bbzt.hv4rvrfc.ihqw7lf3.dati1w0a', element => element.innerText);
    // post.reactionsCount = await page.$eval('.gpro0wi8.cwj9ozl2.bzsjyuwj.ja2t1vim', element => element.innerText);
    // post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)',element => element.innerText);
    // post.sharesCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(2)',element => element.innerText);
    // //end group
    //user post
    // await page.goto('https://www.facebook.com/locnt19/posts/2698067123816168',{waitUntil: 'networkidle2'});
    // let post = {}
    // post.postContent = await page.$eval('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql.ii04i59q', element => element.innerText);
    // post.reactionsCount = await page.$eval('.pcp91wgn', element => element.innerText);
    // post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)',element => element.innerText);
    // //post.sharesCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(2)',element => element.innerText);
    // //end user post

    //await browser.close();
})();
const puppeteer = require('puppeteer');
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
    // //page
    await page.goto('https://www.facebook.com/T1LoL/posts/2799681440266003', { waitUntil: 'networkidle2' });
    let post = {};
    post.content = await page.$eval('.ecm0bbzt.hv4rvrfc.ihqw7lf3.dati1w0a', element => element.innerText);
    post.reactionsCount = await page.$eval('.pcp91wgn', element => element.innerText);
    post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)', element => element.innerText);
    post.sharesCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(2)', element => element.innerText);
    console.log(post);
    await page.click('.pcp91wgn', { waitUntil: 'load' });
    setTimeout(async function () {
        await page.waitForSelector('.j83agx80.cbu4d94t.buofh1pr > div');
        await page.waitForSelector('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m');
        const user = await page.evaluate(() => {
            let _user = document.querySelectorAll('.oi732d6d.ik7dh3pa.d2edcug0.qv66sw1b.c1et5uql.a8c37x1j.muag1w35.enqfppq2.jq4qci2q.a3bd9o3v.ekzkrbhg.oo9gr5id.hzawbc8m a');
            _user = [..._user];
            console.log(_user);
            let user = [];
            for (var i = 0; i < _user.length; i++) {
                const name = _user[i].innerText;
                const url = _user[i].getAttribute('href');
                user.push({
                    name,
                    url,
                });
            }
            return user
        })
        console.log(user);
        //end page
        for (var i = 0; i < user.length; i++) {
            let tempUrl = user[i].url;
            let temp = tempUrl.indexOf("__cft__") - 1;
            let url = tempUrl.slice(0, temp);
            console.log(url);
            if (url.search("id=") != -1) {
                const ProfilePage = await browser.newPage();
                await ProfilePage.goto(url, { waitUntil: 'networkidle2' });
                let _profile = {};
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
                _profile.name = name;
                _profile.nickname = nickname;
                _profile.gender = gender;
                _profile.birthday = birthday;
                _profile.homeTown = homeTown;
                _profile.currentTown = currentTown;
                _profile.currentJob = currentJob;
                _profile.Education = Education;
                console.log(_profile);
                await ProfilePage.close();
            } else {
                const ProfilePage = await browser.newPage();
                await ProfilePage.goto(url, { waitUntil: 'networkidle2' });
                let _profile = {};
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
                _profile.name = name;
                _profile.nickname = nickname;
                _profile.gender = gender;
                _profile.birthday = birthday;
                _profile.homeTown = homeTown;
                _profile.currentTown = currentTown;
                _profile.currentJob = currentJob;
                _profile.Education = Education;
                console.log(_profile);
                await ProfilePage.close();
            }
        };
    }, 30000);
})();
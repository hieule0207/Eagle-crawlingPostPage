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
    list = await page.$eval('.j83agx80.cbu4d94t.buofh1pr', e => { e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' }) });
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
        let url = user[i].url;
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
            return '';
        });
        const currentTown = await ProfilePage.evaluate(() => {
            const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.c9zspvje');
            if (element)
                return element.innerText;
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
    //profile
    // try {
    //     let url = 'https://www.facebook.com/chrispham211'
    //     await page.goto(url, { waitUntil: 'networkidle2' });
    //     let profile = {};
    //     const name = await page.evaluate(() => {
    //         const element = document.querySelector('.gmql0nx0.l94mrbxd.p1ri9a11.lzcic4wl.bp9cbjyn.j83agx80');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     const nickname = await page.evaluate(() => {
    //         const element = document.querySelector('.m6dqt4wy.knj5qynh.h676nmdw');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     let contactAndBasicsUrl = url + '/about_contact_and_basic_info';
    //     await page.goto(contactAndBasicsUrl, { waitUntil: 'networkidle2' });
    //     const gender = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(2)');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     const birthday = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(3) > div:nth-child(3)');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     let aboutPlacesUrl = url + '/about_places';
    //     await page.goto(aboutPlacesUrl, { waitUntil: 'networkidle2' });
    //     const homeTown = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.oygrvhab');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     const currentTown = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi div.c9zspvje');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     let aboutWorkAndEducation = url + '/about_work_and_education';
    //     await page.goto(aboutWorkAndEducation, { waitUntil: 'networkidle2' });
    //     const currentJob = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(1) div.c9zspvje');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     const Education = await page.evaluate(() => {
    //         const element = document.querySelector('div.dati1w0a.tu1s4ah4.f7vcsfb0.discj3wi > div:nth-child(2) > div.oygrvhab');
    //         if (element)
    //             return element.innerText;
    //         return '';
    //     });
    //     profile.name = name;
    //     profile.nickname = nickname;
    //     profile.gender = gender;
    //     profile.birthday = birthday;
    //     profile.homeTown = homeTown;
    //     profile.currentTown = currentTown;
    //     profile.currentJob = currentJob;
    //     profile.Education = Education;
    //     console.log(profile);
    // } catch (error) {
    //     console.log(error)
    // }
    //await browser.close();
})();
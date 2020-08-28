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

//profile
// try {
//     let url = 'https://www.facebook.com/linh.lun.5686'
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
// //await browser.close();
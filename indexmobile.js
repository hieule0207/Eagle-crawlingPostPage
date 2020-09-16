const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://m.facebook.com/", ["geolocation", "notifications"]);
    const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0); 
    await page.setViewport({
        width: 1280,
        height: 500
    });
    await page.goto('https://m.facebook.com/');
    const usernameBox = await page.$('#m_login_email');
    await usernameBox.type('0902757935');

    const passwordBox = await page.$('#m_login_password');
    await passwordBox.type('congnghi12');

    const loginButton = await page.$('._54k8._52jh._56bs._56b_._28lf._9cow._56bw._56bu');
    await loginButton.press('Enter');
    await page.waitForNavigation();
    await page.goto('https://m.facebook.com/T1LoL/posts/2799681440266003', { waitUntil: 'networkidle2' });
    let post = {};
    post.content = await page.$eval('._5rgt._5nk5', element => element.innerText);
    post.reactionsCount = await page.$eval('._1g06', element => element.innerText);
    // post.commentsCount = await page.$eval('.bp9cbjyn.j83agx80.pfnyh3mw.p1ueia1e > div:nth-child(1)', element => element.innerText);
    post.sharesCount = await page.$eval('._43lx._55wr', element => element.innerText);
    console.log(post);
    let urlPostReact = await page.$eval('._45m8', a => a.getAttribute('href'));
    await page.goto('https://m.facebook.com' + urlPostReact, { waitUntil: 'networkidle2' });
    //============loop for click the Readmore button ==================
    var flag = false;
    var i = 1;            
    function myLoop() {         //  create a loop function
        setTimeout(async function () {   //  call a 1s setTimeout when the loop is called
            let readMoreButton = await page.$('.title.mfsm.fcl');
            if (await readMoreButton !== null) {
                console.log(i)
                await readMoreButton.click();
            } else {
                console.log("stop")
                flag = true
                return flag;
            }  
            i++;                    //  increment the counter
            if (i < 51) {           //  if the counter < 51, call the loop function
                myLoop();             //  ..  again which will trigger another 
            } else {
                flag = true;
                console.log(flag);
                return flag;
            }                     //  ..  setTimeout()
        }, 2000)
    }      //  set your counter to 1
    myLoop(); // execute the Loop
    setTimeout(async function () {
        console.log(flag);
        if (flag == true) {
            const user = await page.evaluate(() => {
                let _user = document.querySelectorAll('._1uja');
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
        }
    }, 30000)
})();

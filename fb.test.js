let puppeteer = require('puppeteer');
let browser = null;
let page = null;

describe('fb test', () => {
    // Code này được chạy khi bắt đầu chạy unit test
    beforeAll(async() => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.setViewport({
            width: 1280,
            height: 720
        });
        // Mặc định, timeout của jest là 5s. 
        // Vì web load có thể lâu nên ta tăng lên thành 60s.
        jest.setTimeout(60000);
    });
    // Đóng trình duyệt sau khi đã chạy xong các test case
    afterAll(async() => {
        await browser.close();
    });
    // Trước khi chạy mỗi test case, vào trang chủ của lazada
    beforeEach(async() => {
        await page.goto('https://www.facebook.com/');
    });
})
test('login', async() => {
    //expect.assertions(1);
    const usernameBox = await page.$('#email');
    await usernameBox.type('hieule0207@gmail.com');

    const passwordBox = await page.$('#pass');
    await passwordBox.type('tpg123!@#');

    const loginButton = await page.$('#u_0_b');
    await loginButton.press('Enter');

    await page.waitForNavigation();
});
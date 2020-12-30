require('dotenv').config();
const fs = require('fs');
const puppeteer = require('puppeteer');
let arrayAccounts = [];
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(`https://twitter.com/login`);
    await page.type('input[type="text"]', process.env.TWITTER_ACCOUNT, { delay: 200 });
    await page.type('input[type="password"]', process.env.TWITTER_PASSWORD, { delay: 200 });
    await page.click('div[data-testid="LoginForm_Login_Button"]');
    await page.waitForTimeout(2000);
    for (let account of arrayAccounts) {
        console.log(`GETTING ACCOUNT: [${account}]`);
        await page.goto(`https://twitter.com/${account}/media`);
        await page.waitForTimeout(1000);
        let counter = 0;
        let arrayImgs = [];
        while (counter < process.env.DEEP) {
            let imgs = await page.$$eval('img', (imgs) => imgs.map(img => img.src));
            for (let img of imgs){
                let imgParsed = img.replace('name=small', 'name=large').replace('name=360x360', 'name=large').replace('name=medium', 'name=large');
                if (!arrayImgs.includes(imgParsed)) arrayImgs.push(imgParsed)
            }
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(500);
            counter++
        }
        fs.writeFileSync(`./imgs_${account}.json`, JSON.stringify(arrayImgs));
        console.log(`DONE ACCOUNT: [${account}]`);
    }
    await page.close();
})();
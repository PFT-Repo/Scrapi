const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amazon.es/');
    await page.click('#sp-cc-rejectall-link');
    await page.type('#twotabsearchtextbox', 'vegetarianos');
    await page.click('#nav-search-submit-button');
    await page.waitForSelector('[data-component-type=s-search-result]');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'amazonsearch.jpg' });



    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-component-type=s-search-result] h2 a');
        const links = []
        for (let element of elements) {
            links.push(element.href);
        }
        return links;
    });

    console.log(enlaces.length);
    const libros = [];
    for (let enlace of enlaces) {
        await page.goto(enlace);
        await page.waitForSelector('#productTitle');
        await page.waitForSelector(".author  a");

        const book = await page.evaluate(() => {
            const tmp = {};
            tmp.title = document.querySelector("#productTitle").innerText;
            tmp.author = document.querySelector(".author  a").innerText;
            return tmp;
        });
        libros.push(book);
    }
    console.log(libros);
    await browser.close();
})();
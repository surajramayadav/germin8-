import puppeteer from 'puppeteer';
const cheerio = require('cheerio');




function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


const getAllAddress = async (url: any) => {

    console.log("url", url)

    //launching and opening our page
    const browser = await puppeteer.launch(
        {
            headless: false,
        }
    );
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(function () {
        navigator.geolocation.getCurrentPosition = function (cb: any) {
            setTimeout(() => {
                cb({
                    'coords': {
                        accuracy: 21,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        latitude: 23.129163,
                        longitude: 113.264435,
                        speed: null
                    }
                })
            }, 1000)
        }
    });

    //navigating to a URL
    await page.goto(url);




    //getting access to the raw HTML

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    })

    const $ = cheerio.load(pageData.html);



    let city_name: any = {
        landmark: $('body > main > section.store_locator_main > div > div > div > div.store_leftside > div.store_address > h3:nth-child(2)').text(),
        address: $('body > main > section.store_locator_main > div > div > div > div.store_leftside > div.store_address > p:nth-child(3) ').text(),
        time: $('body > main > section.store_locator_main > div > div > div > div.store_leftside > div.store_address > p:nth-child(5)').text()
    }


    // console.log(city_name)
    await browser.close();
    return city_name

}



export default getAllAddress


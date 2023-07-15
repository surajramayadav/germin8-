import puppeteer from 'puppeteer';
const cheerio = require('cheerio');


const startBrowser = async () => {

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
    await page.goto(process.env.SCRAPE_URL);


    //getting access to the raw HTML

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    })


    const $ = cheerio.load(pageData.html);


    let city_name: any = []
    $('#city-name ').children().each(async (i: number, element: any) => {
        city_name.push({
            name: $(element).attr('value')
        })
    })

    // console.log(city_name)

    await browser.close();

    return city_name

}



export default startBrowser


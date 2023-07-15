import puppeteer from 'puppeteer';
const cheerio = require('cheerio');




function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}


const cityData = async (name: string) => {

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


    // await page.select('select[name="cityName"]', name)

    await page.select('select#city-name', name)

    //getting access to the raw HTML


    // wait for 2 seconds
    await delay(2000)

    const pageData = await page.evaluate(() => {
        return {
            html: document.documentElement.innerHTML,
        };
    })

    const $ = cheerio.load(pageData.html);


    let city_name: any = []
    $('#selectedPOS').children().each(async (i: number, element: any) => {
        if (i != 0) {
            const sepratedString = $(element).attr('value').split(",")
            const url = $(element).text().replace(/ /g, "_");
            console.log(sepratedString[1])
            city_name.push({
                lat: sepratedString[0],
                long: sepratedString[1],
                address: $(element).text(),
                url: `https://www.shoppersstop.com/storecode/${sepratedString[2]}/${url}`
            })
        }

    })

    // console.log(city_name)
    await browser.close();
    return city_name

}



export default cityData


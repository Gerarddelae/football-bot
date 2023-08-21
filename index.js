/* eslint-disable no-undef */
const { chromium } = require("playwright");

(async() => {
    const browser = await chromium.launch()
    const context = await browser.newContext()

    const page = await context.newPage()
    await page.goto("https://www.tarjetarojatv.fr")

    const links = await page.evaluate(() => {
        const names = document.querySelectorAll("tbody tr td b")
        const refs = document.querySelectorAll("tbody tr td a")

        let list = []
        names.forEach((item, index) => list.push({
            title: item.innerText,
            link: refs[index].href
        }))
        return list
    })
    console.log(links[0].title)
    await context.close()
    await browser.close()

})()
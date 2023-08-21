require("dotenv").config()
const { chromium } = require("playwright")
const {Client, IntentsBitField} = require("discord.js")

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

// eslint-disable-next-line no-unused-vars
client.on("ready", async( client ) => {
    console.log("Listo!")
})

client.on("messageCreate", async(message) => {
    if (message.content === "!partidos") {
        const browser = await chromium.launch()
        const context = await browser.newContext()
          
        const page = await context.newPage()
        await page.goto("https://www.tarjetarojatv.fr")
          
        const links = await page.evaluate(() => {
            // eslint-disable-next-line no-undef
            const names = document.querySelectorAll("tbody tr td b")
            // eslint-disable-next-line no-undef
            const refs = document.querySelectorAll("tbody tr td a")
            // eslint-disable-next-line no-undef
            const time = document.querySelectorAll("tbody tr span.t")
          
            let list = []
            names.forEach((item, index) => list.push({
                title: item.innerText,
                link: refs[index].href,
                time: time[index].innerText
            }))
            return list
        })
        await context.close()
        await browser.close()
        const result = links.map(item => `${item.time} | ${item.title} : <${item.link}>`).join("\n")

        console.log(links)
        message.reply(result)
    }
})

client.login(process.env.TOKEN)
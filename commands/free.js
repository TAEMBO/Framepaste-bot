const { MessageEmbed, ButtonInteraction } = require("discord.js");
const { FreeStuffApi } = require("freestuff");

module.exports = {
    run: async (client, message, args) => {
        const games = await client.frs.getGameList('free');
        const gameData = await client.frs.getGameDetails(games, "info", {
            language: ["en-US"]
        });
        const gam = await Object.values(gameData);
        console.log(gam)
        if(!gam.length) return embed.addField("Huh!", "Looks like no free games today! (try running the command again to reload the API)") && message.reply({embeds: [embed]});
        const boi = [];
        gam.forEach((data)=>{
            boi.push(`[${data.title}](${data.urls.org})\n<:blank:948403007970770994> ~~$${data.org_price.usd}~~ • **Free** until <t:${Math.floor(new Date(data.until).getTime()/1000)}:d>`)
        });
        const embed = new MessageEmbed().setTitle("These games are currently free:").setColor(3092790).setDescription(`${boi.map(x=>x).join("\n\n")}`)
        message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
    },
    name: "frs",
    description: "Fetch Today's Free Games!"
};

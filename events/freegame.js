const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "free_games",
    frs: true,
    giveaway: false,
    tracker: false,
    execute: async (client, frs, games) => {
        const channel = await client.channels.fetch(client.config.mainServer.channels.freegames);
        const gameData = await frs.getGameDetails(games, "info", {
            language: ["en-US"]
        });
        const gams = await Object.values(gameData);
        await gams.forEach(async (game)=>{
            channel.send({embeds: [new MessageEmbed().setTitle(game.title).setDescription(`~~$${game.org_price.usd}~~ • **Free** until <t:${Math.floor(new Date(game.until).getTime()/1000)}:d>`).setColor(3092790).setImage(game.thumbnail.org)], components: [new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL(game.urls.org).setLabel("Open In Browser"))]});
        });
        await channel.send({content: `<@&${client.config.mainServer.roles.free_game}>`})
    }
}
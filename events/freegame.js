const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "free_games",
    frs: true,
    giveaway: false,
    tracker: false,
    execute: async (client, frs, games) => {
        if (!client.config.botSwitches.freeGames) return;
        const channel = await client.channels.fetch(client.config.mainServer.channels.freegames);
        const gameData = await frs.getGameDetails(games, "info", {
            language: ["en-US"]
        });
        const gams = await Object.values(gameData);
        const embeds = []
        await gams.forEach(async (game)=>{
            embeds.push(new MessageEmbed().setTitle(game.title).setDescription(`~~$${game.org_price.usd}~~ • **Free** until <t:${Math.floor(new Date(game.until).getTime()/1000)}:d>`).setColor(3092790).setImage(game.thumbnail.org).addFields({name: "Open In Browser", value: `[link](${game.urls.org})`, inline: true}, {name: `Open In ${game.store}`, value: `<${game.urls.client}>`, inline: true}))
        });
        await channel.send({content: `<@&${client.config.mainServer.roles.freegames}>`, embeds: embeds});
    }
}
const { MessageEmbed, MessageActionRow, MessageButton, Interaction } = require("discord.js");
const YClient = require("../client");

module.exports = {
    name: "free_games",
    frs: true,
    giveaway: false,
    tracker: false,
    execute: async (client, frs, games) => {
        if (!client.config.botSwitches.freeGames) return;
        const channel = await client.channels.fetch(client.config.mainServer.channels.freegames);
        const acceptance = await client.channels.fetch(client.config.mainServer.channels.modlogs);
        const gameData = await frs.getGameDetails(games, "info", { language: ["en-US"] });
        const gams = await Object.values(gameData);
        const msg = await acceptance.send({content: `<@&${client.config.mainServer.roles.botdeveloper}>`, embeds: [new MessageEmbed().setDescription(`${gams.map(x=>x.title).join(", ")}`).setTitle("New Game(s)!").setColor(client.config.embedColor)], components: [new MessageActionRow().addComponents(new MessageButton({label: "Accept", style: "SUCCESS", customId: "SEND"}), new MessageButton({label: "Deny", style: "DANGER", customId: "STOP"}))]})
        const filter = i => ["SEND", "STOP"].includes(i.customId) && client.hasModPerms(client, i.member) && i.message.id === msg.id;
        const collector = await acceptance.createMessageComponentCollector({ max: 1, filter, time: 18_000_000 });
        collector.on("collect", async (interaction) => {
            if(interaction.customId === "SEND"){
                await interaction.message.edit({content: interaction.message.content, embeds: [interaction.message.embeds[0]], components: []});
                await interaction.reply({content: `Sending....`});
                const embeds = []
                await gams.forEach(async (game)=>{
                    embeds.push(new MessageEmbed().setTitle(game.title).setDescription(`~~$${game.org_price.usd}~~ • **Free** until <t:${Math.floor(new Date(game.until).getTime()/1000)}:d>`).setColor(3092790).setImage(game.thumbnail.org).addFields({name: "Open In Browser", value: `[link](${game.urls.org})`, inline: true}, {name: `Open In ${game.store}`, value: `<${game.urls.client}>`, inline: true}))
                });
                await channel.send({content: `<@&${client.config.mainServer.roles.freegames}>`, embeds: embeds});
            } else if(interaction.customId === "STOP"){
                await interaction.message.edit({content: interaction.message.content, embeds: [interaction.message.embeds[0]], components: []});
                await interaction.reply({embeds: [new MessageEmbed().setTitle(`Sending Games Canceled By ${interaction.user.username}`).setTimestamp(new Date()).setColor("#666666")]})
            }
        });
    }
}

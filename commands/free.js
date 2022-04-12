const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, ButtonInteraction } = require("discord.js");
const { FreeStuffApi } = require("freestuff");

module.exports = {
    run: async (client, interaction) => {
        if (!client.config.botSwitches.freeGames) return interaction.reply({content: 'This function is disabled.', allowedMentions: {repliedUser: false}});
        const games = await client.frs.getGameList('free');
        const gameData = await client.frs.getGameDetails(games, "info", {
            language: ["en-US"]
        });
        const gam = await Object.values(gameData);
        gam.forEach((data)=>{
            boi.push(`[${data.title}](${data.urls.org})\n<:blank:948403007970770994> ~~$${data.org_price.usd}~~ • **Free** until <t:${Math.floor(new Date(data.until).getTime()/1000)}:d>`)
        });
        const embed = new MessageEmbed().setTitle("These games are currently free:").setColor(3092790).setDescription(`${gam.length !== 0 ? boi.map(x=>x).join("\n\n") : "Huh! Looks like their are no free games currently, try running the command again to reload the API."}`)
        interaction.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
    },
    data: new SlashCommandBuilder().setName("free").setDescription("Fetch Today's Free Games!")
};

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const casesJson = require("../databases/punishments.json");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatecase')
        .setDescription('Update a case')
            .addIntegerOption(caseid => caseid
                .setName('caseid')
                .setDescription('The case ID')
                .setRequired(true))
            .addStringOption(descriiption => descriiption
                .setName('reason')
                .setDescription('The new case reason')
                .setRequired(true)),
    run: async (client, interaction) => {

        const caseid = interaction.options.getInteger('caseid');
        const reason = interaction.options.getString('reason');

        casesJson.forEach(casee => {
            if (casee.id === caseid) {
                casee.reason = reason;
            }
        });

        interaction.reply(__dirname)

        fs.writeFileSync(require("../databases/punishments.json"), JSON.stringify(casesJson));
    }
}
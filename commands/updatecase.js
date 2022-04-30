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

        try {
            fs.writeFileSync(path.resolve('./databases/punishments.json'), JSON.stringify(casesJson));
            const sucessEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setTitle('Case updated')
                .setDescription(`Case ${caseid} has been updated\nNew reason: ${reason}`);

            interaction.reply({embeds: [sucessEmbed] });
        }catch(err){
            console.log(err);
            const errorEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Error')
                .setDescription('An error occurred while updating the case, ask TÆMBØ to check the console  ');

            interaction.reply({embeds: [errorEmbed] });
        }
    }
}
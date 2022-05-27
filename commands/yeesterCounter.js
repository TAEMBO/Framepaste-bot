const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require('fs')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('yestercounter')
        .setDescription('Yeester counter')
        .addSubcommand(reset => reset
            .setName('reset')
            .setDescription('resets the counter to 0 since yeester said something'))
        .addSubcommand(counter => counter
            .setName('view')
            .setDescription('view since when yeester didn\'t talk'))
        .addSubcommand(counter => counter
            .setName('set')
            .setDescription('set the counter to some unix timestamp')
            .addIntegerOption(int => int
                .setName('time')
                .setDescription('time')
                .setRequired(true))),
    run: async (client, interaction) => {
        let database = require('../databases/counter.json')

        if(!database.time){
            database.time = Date.now().toString();
        }

        if(interaction.options.getSubcommand() ===  'reset'){
            if(!client.hasModPerms(client, interaction.member)){
                await interaction.reply({content: 'You don\'t have perms to use this command', ephemeral: true})
                return;
            }
            database.time = Math.round(new Date() / 1000)
            await interaction.reply({content: `The counter has been reset to today: <t:${Math.round(new Date() / 1000)}>`})
        }else if(interaction.options.getSubcommand() ===  'set'){
            const time = interaction.options.getInteger('time')
            if(!client.hasModPerms(client, interaction.member)){
                await interaction.reply({content: 'You don\'t have perms to use this command', ephemeral: true})
                return;
            }
            database.time = time
            await interaction.reply({content: `The counter has been set to <t:${time}>`})
        }else if(interaction.options.getSubcommand() === 'view'){
            await interaction.reply({content: `Yeester didn't talk since <t:${database.time}>`})
        }

        fs.writeFileSync('../databases/counter.json', JSON.stringify(database))

        database = "dsakldjkasljd";
        console.log(database)
    }
}
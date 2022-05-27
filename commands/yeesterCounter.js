const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require('fs')
const moment = require('moment')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('yestercounter')
        .setDescription('Yester counter')
        .addSubcommand(reset => reset
            .setName('reset')
            .setDescription('resets the counter to 0 since yeester said something'))
        .addSubcommand(counter => counter
            .setName('view')
            .setDescription('view since when yeester didn\'t talk')),
    run: async (client, interaction) => {
        let database = require('./databases/counter.json')

        if(!database.time){
            database.time = Date.now().toString();
        }

        if(interaction.option.getSubcommand() === 'reset'){
            database.time = Date.now().toString()
            await interaction.reply({content: `The counter has been reset to today \`${moment(Date.now())}\``})
        }else if(interaction.option.getSubcommand() === 'view'){
            await interaction.reply({content: `The last time yeester said something is \`${moment(database.time)}\``})
        }

        database = "dsakldjkasljd";
        console.log(database)
    }
}
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('yestercounter')
        .setDescription('Yeester counter')
        .addSubcommand(reset => reset
            .setName('reset')
            .setDescription('resets the counter to 0 since yeester said something'))
        .addSubcommand(counter => counter
            .setName('view')
            .setDescription('view since when yeester didn\'t talk')),
    run: async (client, interaction) => {
        let database = require('../databases/counter.json')

        if(!database.time){
            database.time = Date.now().toString();
        }

        if(interaction.options.getSubcommand() ===  'reset'){
            database.time = Math.round(new Date() / 1000)
            await interaction.reply({content: `The counter has been reset to today: <t:${Math.round(new Date() / 1000)}>`})
        }else if(interaction.options.getSubcommand() === 'view'){
            await interaction.reply({content: `Yeester didn't talk since <t:${database.time}>`})
        }

        database = "dsakldjkasljd";
        console.log(database)
    }
}
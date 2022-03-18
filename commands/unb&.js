const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    run: (client, interaction) => {        
        const member = interaction.options.getUser("member");
        interaction.reply({content: "ok", ephemeral: true})
        if(!member){
            return interaction.channel.send({content: `Your honorary ban has been revoked!`});
        } else {
            return interaction.channel.send({content: `<@${member.id}> had their honorary ban revoked!`})}
    },
    data: new SlashCommandBuilder().setName("unband").setDescription("Revokes an honorary ban.").addUserOption((opt)=>opt.setName("member").setDescription("The member whom will get their honorary ban revoked.").setRequired(false))
};
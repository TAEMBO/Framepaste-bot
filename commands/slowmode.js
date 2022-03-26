const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = { 
	run: (client, interaction) => {
		if(!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.moderator).id}> role to use this command.`, allowedMentions: {roles: false}})
        const time = interaction.options.getInteger("time");
        
        if(time > 21600) return interaction.reply({content: 'The slowmode limit is 6 hours (\`21600\` seconds).', allowedMentions: {repliedUser: false}})
        interaction.channel.setRateLimitPerUser(time, `Done by ${interaction.user.tag}`)
        if(time === '0') {
            interaction.reply({content: 'Slowmode removed.', allowedMentions: {repliedUser: false}})
        } else return interaction.reply({content: `Slowmode set to ${time === 1 ? `\`${time}\` second` : `\`${time}\` seconds`}.`, allowedMentions: {repliedUser: false}})
	},
    data: new SlashCommandBuilder().setName("slowmode").setDescription("Sets the slowmode to the provided amount.").addIntegerOption((opt)=>opt.setName("time").setDescription("The time amount for the slowmode").setRequired(true))
};
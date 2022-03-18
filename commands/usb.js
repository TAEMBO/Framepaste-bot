const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
		interaction.reply({content: 'https://cdn.discordapp.com/attachments/571031705109135361/797223985347297300/unknown.png https://cdn.discordapp.com/attachments/915420466238349322/925219461097726032/usb-types.png', allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("usb").setDescription("Shows USB names and their bandidth.")
};

const {SlashCommandBuilder} = require("@discordjs/builders")
module.exports = {
	run: (client, interaction) => {
		client.punish(client, interaction, 'mute');
	},
	data: new SlashCommandBuilder().setName("mute").setDescription("Mutes a member.").addUserOption((opt)=>opt.setName("member").setDescription("The member to mute").setRequired(true)).addStringOption((opt)=>opt.setName("time").setDescription("The time for the mute.")).addStringOption((opt)=>opt.setName("reason").setDescription("The reason for banning the member.").setRequired(false)),
};
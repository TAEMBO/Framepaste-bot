const { SlashCommandBuilder } = require("@discordjs/builders");
const { User } = require("discord.js");

module.exports = {
	run: async (client, interaction, user) => {
		const member = interaction.options.getMember("member") ?? interaction.member;
		await member.user.fetch();
		const embed = new client.embed()
		    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 2048}) || member.user.defaultAvatarURL)
			.setTitle(`User info: ${member.user.tag}`)
			.addField(':small_blue_diamond: Account Creation Date', `${member.user.createdAt.getUTCFullYear()}-${('0' + (member.user.createdAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.user.createdAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.user.createdTimestamp, 1, { longNames: true })} ago`)
			.addField(':small_blue_diamond: Join Date', `${member.joinedAt.getUTCFullYear()}-${('0' + (member.joinedAt.getUTCMonth() + 1)).slice(-2)}-${('0' + member.joinedAt.getUTCDate()).slice(-2)} (YYYY-MM-DD), ${client.formatTime(Date.now() - member.joinedTimestamp, 1, { longNames: true })} ago`)
			.addField(':small_blue_diamond: ID, Nickname, and Mention', `ID: ${member.user.id}\nNickname: ${member.nickname ? member.nickname : 'None'}\nMention: ${member.toString()}`)
			.addField(':small_blue_diamond: Roles', member.roles.cache.size > 1 ? member.roles.cache.filter(x => x.id !== interaction.guild.roles.everyone.id).sort((a, b) => b.position - a.position).map(x => x).join(member.roles.cache.size > 4 ? ' ' : '\n').slice(0, 1024) : 'None')
			.setColor(member.displayColor || '#fefefe')
			.setImage(member.user.bannerURL({ format: 'png', dynamic: true, size: 1024}))
		interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("userinfo").setDescription("Gets info on a user.").addUserOption((opt)=>opt.setName("member").setDescription("The member to get info on.").setRequired(true))
};
const { SlashCommandBuilder } = require("@discordjs/builders");
const { User } = require("discord.js");

module.exports = {
	run: async (client, interaction, user) => {
		const member = interaction.options.getMember("member") ?? interaction.member;
		await member.user.fetch();
		const embed = new client.embed()
		    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true, size: 2048}) || member.user.defaultAvatarURL)
			.setTitle(`Member info: ${member.user.tag}`)
			.setURL(`https://discord.com/users/${member.user.id}`)
			.setDescription(`<@${member.user.id}>\n\`${member.user.id}\``)
			.addFields(
			{name: '🔹 Account Creation Date', value: `<t:${Math.round(new Date(member.user.createdTimestamp) / 1000)}>\n<t:${Math.round(new Date(member.user.createdTimestamp) / 1000)}:R>`},
			{name: '🔹 Join Date', value: `<t:${Math.round(new Date(member.joinedTimestamp) / 1000)}>\n<t:${Math.round(new Date(member.joinedTimestamp) / 1000)}:R>`},
			{name: '🔹 Roles', value: member.roles.cache.size > 1 ? member.roles.cache.filter(x => x.id !== interaction.guild.roles.everyone.id).sort((a, b) => b.position - a.position).map(x => x).join(member.roles.cache.size > 4 ? ' ' : '\n').slice(0, 1024) : 'None'})
			.setColor(member.displayColor || client.config.embedColor)
			.setImage(member.user.bannerURL({ format: 'png', dynamic: true, size: 1024}))
			if (member.user.id === interaction.guild.ownerId) embed.setDescription(`<@${member.user.id}>\n\`${member.user.id}\`\n__**Server Owner**__ <:crown:945149846506078250>`)
		interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("whois").setDescription("Gets info on a user.").addUserOption((opt)=>opt.setName("member").setDescription("The member to get info on.").setRequired(true))
};
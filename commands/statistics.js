const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
		const colunms = ['Command Name', 'Count'];
		const includedCommands = client.commands.filter(x => x.uses).sort((a, b) => b.uses - a.uses);
		if (includedCommands.size === 0) return interaction.reply({content: `No commands have been used yet.\nUptime: ${client.formatTime(client.uptime, 2, { commas: true, longNames: true })}`, allowedMentions: {repliedUser: false}}); 
		const nameLength = Math.max(...includedCommands.map(x => x.data.name.length), colunms[0].length) + 2;
		const amountLength = Math.max(...includedCommands.map(x => x.uses.toString().length), colunms[1].length) + 1;
		const rows = [`${colunms[0] + ' '.repeat(nameLength - colunms[0].length)}|${' '.repeat(amountLength - colunms[1].length) + colunms[1]}\n`, '-'.repeat(nameLength) + '-'.repeat(amountLength) + '\n'];
		includedCommands.forEach(command => {
			const name = command.data.name;
			const count = command.uses.toString();
			rows.push(`${name + '.'.repeat(nameLength - name.length)}${'.'.repeat(amountLength - count.length) + count}\n`);
		});
		const embed = new client.embed()
			.setTitle('Statistics: Command Usage')
			.setDescription('List of commands that have been used in this session, ordered by amount of uses. Table contains command name and amount of uses.\nTotal amount of commands used in this session: ' + client.commands.filter(x => x.uses).map(x => x.uses).reduce((a, b) => a + b, 0) + '\nCommands used per category:\n' + client.categoryNames.map(x => `${x}: ${client.commands.filter(y => y.category === x && y.uses).map(x => x.uses).reduce((a, b) => a + b, 0)}`).join('\n'))
			.setColor(client.config.embedColor)
			.setFooter({text: `Uptime: ${client.formatTime(client.uptime, 2, { commas: true, longNames: true })}`})
		if (rows.join('').length > 1024) {
			let fieldValue = '';
			rows.forEach(row => {
				if (fieldValue.length + row.length > 1024) {
					embed.addFields({name: '\u200b', value: `\`\`\`\n${fieldValue}\`\`\``});
					fieldValue = row;
				} else {
					fieldValue += row
				}
			});
			embed.addFields({name: '\u200b', value: `\`\`\`\n${fieldValue}\`\`\``});
		} else {
			embed.addFields({name: '\u200b', value: `\`\`\`\n${rows.join('')}\`\`\``});
		}
		interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
	},
	data: new SlashCommandBuilder().setName("statistics").setDescription("See a list of commands ordered by usage.")
};
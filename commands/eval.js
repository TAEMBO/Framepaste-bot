const { SlashCommandBuilder } = require('@discordjs/builders');
const util = require('util');
const removeUsername = (text) => {
	let matchesLeft = true;
	const array = text.split('\\');
	while (matchesLeft) {
		let usersIndex = array.indexOf('Users');
		if (usersIndex < 1) matchesLeft = false;
		else {
			let usernameIndex = usersIndex + 1;
			if (array[usernameIndex].length === 0) usernameIndex += 1;
			array[usernameIndex] = '#'.repeat(array[usernameIndex].length);
			array[usersIndex] = 'Us\u200bers';
		}
	}
	return array.join('\\');
};
module.exports = {
	run: async (client, interaction) => {
		if (!client.config.eval.allowed) return interaction.reply({content: 'Eval is disabled.', allowedMentions: { repliedUser: false }});
		if (!client.config.eval.whitelist.includes(interaction.user.id) && !interaction.member.roles.cache.has(client.config.mainServer.roles.botdeveloper)) return interaction.reply({content: 'You\'re not allowed to use eval', allowedMentions: { repliedUser: false }});
		const code = interaction.options.getString("code")
		let output = 'error';
		let error = false;
		try {
			output = await eval(code);
		} catch (err) {
			error = true;
			const embed = new client.embed()
				.setTitle('__Eval__')
				.addFields({name: 'Input', value: `\`\`\`js\n${code.slice(0, 1010)}\n\`\`\``}, {name: 'Output', value: `\`\`\`\n${err}\n\`\`\``})
				.setColor('ff0000');
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }}).catch((e)=>interaction.channel.send({embeds: [embed]})).then(errorEmbedMessage => {
				const filter = x => x.content === 'stack' && x.author.id === interaction.user.id
				const messagecollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });
				messagecollector.on('collect', collected => {
					collected.reply({content: `\`\`\`\n${removeUsername(err.stack)}\n\`\`\``, allowedMentions: { repliedUser: false }});
				});
			});
		}
		if (error) return;
		if (typeof output === 'object') {
			output = 'js\n' + util.formatWithOptions({ depth: 1 }, '%O', output);
		} else {
			output = '\n' + String(output);
		}
		const regexp = new RegExp(client.token, 'g');
		output = output.replace(regexp, 'TOKEN_LEAK');
		const embed = new client.embed()
			.setTitle('__Eval__')
			.addFields({name: 'Input', value:`\`\`\`js\n${code.slice(0, 1010)}\n\`\`\``}, {name: 'Output', value: `\`\`\`${removeUsername(output).slice(0, 1016)}\n\`\`\``})
			.setColor(client.config.embedColor);
		interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }}).catch((e)=>interaction.channel.send({embeds: [embed]}));
	},
	data: new SlashCommandBuilder().setName("eval").setDescription("Evaluates some code!").addStringOption((opt)=>opt.setName("code").setDescription("The code to eval!").setRequired(true))
};
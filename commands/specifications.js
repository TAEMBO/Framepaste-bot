const { SlashCommandBuilder } = require("@discordjs/builders");
const { version } = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
		const subCmd = interaction.options.getSubcommand()
			if (subCmd === 'help') {
				const embed = new client.embed()
					.setTitle(`Help: /specs`)
					.setDescription('This command makes it possible to store and view user-generated information about your or someone else\'s computer specs.')
					.setColor(client.config.embedColor)
					.addFields(
					{name: 'Adding your own specs', value: `To add your own specs, you can do \`/specs add [component]: [name]\`. The component should be a universally known term, such as "CPU", "RAM" or "Video Card". The name should contain the name of the part that you own, and some additional info, for example "AMD Ryzen 5 5600x 6-core 12-thread Socket AM4". Make sure that the capitalization on both, the component and name, is correct. It is important to separate the component and name with a colon \`:\`.`},
					{name: 'Viewing specs', value: `To view your own specs, you can do \`/specs\`. To view specs of other people, you can do \`/specs [user]\`. User can be a mention, id or username.`},
					{name: 'Editing specs', value: `To edit your own specs, you can do \`/specs edit [component]: [new name]\`. Component capitalization doesn't matter. The old name will be overwritten by the new name. You cannot edit the component part, only the name.`},
					{name: 'Deleting specs', value: `To delete all your specs, you can do \`/specs delete\`. To delete a single component from your specs you can do \`/specs delete [component]\`. Component capitalization doesn't matter.`})
				interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			} else if (subCmd === 'add') {
				const endPart = interaction.options.getString("info")
				const colonIndex = endPart.indexOf(':') >= 0 ? endPart.indexOf(':') : endPart.indexOf(' ');
				if (!endPart) return interaction.reply('You need to add a component.');
				if (endPart.length > 256) return interaction.reply('The component or name is too long.');
				const component = endPart.slice(0, colonIndex).trim();
				if (!component) return interaction.reply('You need to add a colon.');
				const name = endPart.slice(colonIndex + 1).trim();
				if (!name) return interaction.reply('You need to add a name.');
				if (!client.specsDb.hasUser(interaction.user.id)) client.specsDb.addData(interaction.user.id, {});
				client.specsDb.addSpec(interaction.user.id, component, name);
				return interaction.reply(`Successfully added "${component}: ${name}" to your specs.`);
			} else if (subCmd === 'edit') {
				if (!client.specsDb.hasUser(interaction.user.id)) return interaction.reply('You haven\'t added any specs.');
				const endPart = interaction.options.getString("info");
				const colonIndex = endPart.indexOf(':') >= 0 ? endPart.indexOf(':') : endPart.indexOf(' ');
				if (!endPart) return interaction.reply('You need to add a component.');
				if (endPart.length > 256) return interaction.reply('The component or name is too long.');
				const component = endPart.slice(0, colonIndex).trim();
				if (!component) return interaction.reply('You need to add a colon.');
				const name = endPart.slice(colonIndex + 1).trim();
				if (!name) return interaction.reply('You need to add a name.');
				if (!client.specsDb.hasSpec(interaction.user.id, component)) return interaction.reply('You haven\'t added that spec.');
				client.specsDb.editSpecs(interaction.user.id, component, name);
				return interaction.reply(`Successfully edited "${component}", new value is "${name}".`);
			} else if (subCmd === 'delete') {
				if (!client.specsDb.hasUser(interaction.user.id)) return interaction.reply('You haven\'t added any specs.');
				const component = interaction.options.getString("component");
				if (component) {
					if (!client.specsDb.hasSpec(interaction.user.id, component)) return interaction.reply('You haven\'t added that spec.');
					client.specsDb.deleteSpec(interaction.user.id, component);
					return interaction.reply(`Successfully deleted "${component}" from your specs.`);
				} else {
					client.specsDb.deleteData(interaction.user.id);
					return interaction.reply(`Successfully deleted all your specs.`);
				}
			} else {
				const member = interaction.options.getMember("member");
				if (member){
				if (!client.specsDb.hasUser(member.user.id)) return interaction.reply('They haven\'t added any specs yet.');
				const embed = client.displaySpecs(client, member);
				if (member.user.id === '795443537356521502') {
					developers = await interaction.guild.roles.fetch('914646059714768906')
					embed.addFields({name: 'Developers', value: `${developers.members.map(e=>`<@${e.user.id}>`).join("\n") || "None"}`}, {name: 'Package', value: `Discord.js V${version}`})
				}
				return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			} else {
				if (!client.specsDb.hasUser(interaction.user.id)) return interaction.reply({content: `You haven\'t added any specs yet. Do \`/specs help\` to learn more.`, allowedMentions: { repliedUser: false }});
				const embed = client.displaySpecs(client, interaction.member);
				interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			}
			}
	},
	data: new SlashCommandBuilder().setName("specs").setDescription("View, edit, add, or delete your specs").addSubcommand((optt)=>optt.setName("help").setDescription("Shows you how to use the command")).addSubcommand((optt)=>optt.setName("add").setDescription("Adds a component to your specs.").addStringOption((opt)=>opt.setName("info").setDescription("The info to add.").setRequired(true))).addSubcommand((optt)=>optt.setName("edit").setDescription("Edits a component in your specs.").addStringOption((opt)=>opt.setName("info").setDescription("The info to edit.").setRequired(true))).addSubcommand((optt)=>optt.setName("delete").setDescription("Deletes a component to your specs, or all your specs if no component is provided.")).addSubcommand((optt)=>optt.setName("view").setDescription("Views a user's specs.").addUserOption((opt)=>opt.setName("member").setDescription("The member to view specs of.").setRequired(false)))
};

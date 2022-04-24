const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
        if(!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${interaction.guild.roles.cache.get(client.config.mainServer.roles.mod).id}> role to use this command.`, allowedMentions: {roles: false}})
        const member = interaction.options.getMember("member");
        if(member.roles.cache.has(client.config.mainServer.roles.helper)){
            const msg = await interaction.reply({content: "This member already has the helper role, would you like me to remove it from them?", fetchReply: true, components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`Yes`).setStyle("SUCCESS").setLabel("Confirm"), new MessageButton().setCustomId(`No`).setStyle("DANGER").setLabel("Cancel"))]});
            const filter = (i) => ["Yes", "No"].includes(i.customId) && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({filter, max: 1, time: 30000});
            collector.on("collect", async (int) => {
                if(int.customId === "Yes"){
                    member.roles.remove(client.config.mainServer.roles.helper);
                    int.update({content: `Ok, I have Removed The Helper Role From <@${member.user.id}>`, components: []})
                } else if(int.customId === "No"){
                    int.update({content: "Alrighty, I have canceled the command!", components: []});
                }
            });
        } else {
            member.roles.add(client.config.mainServer.roles.helper);
            interaction.reply({embeds: [new client.embed().setDescription(`Ok, I have Given <@${member.user.id}> The Helper Role!`).setColor(client.config.embedColor)]});
        }
	},
    data: new SlashCommandBuilder().setName("helper").setDescription("Adds or removes the helper role from a user").addUserOption((opt)=>opt.setName("member").setDescription("The member to add or remove the role from").setRequired(true))
};
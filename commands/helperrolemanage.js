const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	run: async (client, interaction) => {
        if(!client.hasModPerms(client, interaction.member)) return interaction.reply({content: `You need the <@&${client.config.mainServer.roles.mod}> role to use this command.`, allowedMentions: {roles: false}})
        const member = interaction.options.getMember("member");
        if(member.roles.cache.has(client.config.mainServer.roles.helper)){
            const msg = await interaction.reply({embeds: [new client.embed().setDescription(`This user already has the <@&${client.config.mainServer.roles.helper}> role, do you want to remove it from them?`).setColor(client.config.embedColor)], fetchReply: true, components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`Yes`).setStyle("SUCCESS").setLabel("Confirm"), new MessageButton().setCustomId(`No`).setStyle("DANGER").setLabel("Cancel"))]});
            const filter = (i) => ["Yes", "No"].includes(i.customId) && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({filter, max: 1, time: 30000});
            collector.on("collect", async (int) => {
                if(int.customId === "Yes"){
                    member.roles.remove(client.config.mainServer.roles.helper);
                    int.update({embeds: [new client.embed().setDescription(`<@${member.user.id}> has been removed from the <@&${client.config.mainServer.roles.helper}> role`).setColor(client.config.embedColor)], components: []})
                } else if(int.customId === "No"){
                    int.update({embeds: [new client.embed().setDescription(`Command canceled`).setColor(client.config.embedColor)], components: []});
                }
            });
        } else {
            member.roles.add(client.config.mainServer.roles.helper);
            interaction.reply({embeds: [new client.embed().setDescription(`Ok, I have Given <@${member.user.id}> The Helper Role!`).setColor(client.config.embedColor)]});
        }
	},
    data: new SlashCommandBuilder().setName("helper").setDescription("Adds or removes the helper role from a user").addUserOption((opt)=>opt.setName("member").setDescription("The member to add or remove the role from").setRequired(true))
};

const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	run: async (client, message, args) => {
        if(!client.hasModPerms(client, message.member)) return message.channel.send({content: "You Don't Have The **Moderator** Role!"})
        const member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => undefined));
        if(!member && !args[1]) return message.channel.send({content: "You haven't mentioned a member."});
        if(member.roles.cache.has("903534357858369576")){
            const msg = await message.channel.send({content: "This member already has the helper role, would you like me to remove it from them?", components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`yes`).setStyle("SUCCESS").setLabel("Confirm"), new MessageButton().setCustomId(`no`).setStyle("DANGER").setLabel("Cancel"))]});
            const filter = (i) => ["yes", "no"].includes(i.customId) && i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({filter, max: 1, time: 30000});
            collector.on("collect", async (interaction) => {
                if(interaction.customId === "yes"){
                    member.roles.remove("903534357858369576");
                    message.channel.send({content: `Ok, I have Removed The Helper Role From <@${member.user.id}>`});
                    msg.delete();
                } else if(interaction.customId === "no"){
                    message.channel.send({content: "Alrighty, I have canceled the command!"});
                    msg.delete();
                }
            });
        } else {
            member.roles.add("903534357858369576");
            message.channel.send({embeds: [new client.embed().setDescription(`Ok, I have Given <@${member.user.id}> The Helper Role!`).setColor(client.embedColor)]});
        }
	},
	name: 'helperroleadd',
	alias: ['hra'],
	description: 'Adds the helper role to a user',
	category: 'Moderation'
};
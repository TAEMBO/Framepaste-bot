const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
	run: async (client, message, args) => {
        if(!client.hasModPerms(client, message.member)) return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }})
        const member = message.mentions.members?.first() || (await client.getMember(message.guild, args[1]).catch(() => undefined));
        if(!member && !args[1]) return message.channel.send({content: "You haven't mentioned a member."});
        if(member.roles.cache.has(client.config.mainServer.roles.helper)){
            const msg = await message.channel.send({content: "This member already has the helper role, would you like me to remove it from them?", components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`Yes`).setStyle("SUCCESS").setLabel("Confirm"), new MessageButton().setCustomId(`No`).setStyle("DANGER").setLabel("Cancel"))]});
            const filter = (i) => ["Yes", "No"].includes(i.customId) && i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({filter, max: 1, time: 30000});
            collector.on("collect", async (interaction) => {
                if(interaction.customId === "Yes"){
                    member.roles.remove(client.config.mainServer.roles.helper);
                    message.channel.send({content: `Ok, I have Removed The Helper Role From <@${member.user.id}>`});
                    msg.delete();
                } else if(interaction.customId === "No"){
                    message.channel.send({content: "Alrighty, I have canceled the command!"});
                    msg.delete();
                }
            });
        } else {
            member.roles.add(client.config.mainServer.roles.helper);
            message.channel.send({embeds: [new client.embed().setDescription(`Ok, I have Given <@${member.user.id}> The Helper Role!`).setColor(client.config.embedColor)]});
        }
	},
	name: 'helperrolemanage',
	alias: ['hrm'],
	description: 'Adds or removes the helper role from a user',
	category: 'Moderation'
};
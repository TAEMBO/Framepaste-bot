const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
	run: (client, interaction) => {
        const embed = new client.embed()
        .setTitle(`How to reset BIOS settings to default`)
        .setImage('https://cdn.discordapp.com/attachments/873057501548007465/930162585825869905/SmartSelect_20220110-131251_Discord.gif')
        .setDescription('**1.** Shut the PC down, turn off the PSU and unplug it\n**2.** Find the Clear CMOS pins on your motherboard, labeled JBAT, CLRCMOS, or CLRTC. (Consult your manual for name and location)\n**3.** Use a metal screwdriver to touch and hold on both pins for 10 seconds, then remove screwdriver from the pins\n**4.** Plug in PSU, Turn PSU on, and boot the PC')
        .setColor(client.config.embedColor)
        .setFooter({text: 'cloned from discord.gg/buildapc', iconURL: 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp'});
        interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
	},
	data: new SlashCommandBuilder().setName("cmos").setDescription("How to reset BIOS settings to default."),
};
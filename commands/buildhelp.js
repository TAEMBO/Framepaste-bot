const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: (client, interaction) => {
        const embed = new client.embed()
        .setTitle(`How to get help with a new PC build`)
        .setDescription('**1:** Your budget/location/time of purchase?\n\n**2:** Which local retailers (digital or physical, like Micro Center) are available?\n\n**3:** What are you using the PC for? ex. 1440p 144FPS shooters, entry level streaming, 4K RED Adobe Premiere\n\n**4:** Any aesthetic preferences? ex. color scheme, form factor, side panel, RGB\n\n**5:** Interest in overclocking (CPU/GPU/RAM)? More performance in exchange for time, heat, power, lower stability\n\n**6:** Extras/peripherals? ex. monitor, mouse, keyboard, headphones, microphone, WiFi')
        .setColor(client.config.embedColor)
        .setFooter({text: 'cloned from discord.gg/buildapc', iconURL: 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp'});
        interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
	},
    data: new SlashCommandBuilder().setName("buildhelp").setDescription("How to get help with a new PC build."),
    category: 'Real Computers'
};
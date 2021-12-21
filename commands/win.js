module.exports = {
	run: (client, message, args) => {
        const embed = new client.embed()
        .setTitle(`How to create a Windows 10 installation media`)
        .setDescription('This method only works on Windows 10 PCs. Please ask for other methods if using a Mac, Linux, or earlier versions of Windows.\nhttps://www.microsoft.com/software-download/windows10\n**1.** Insert an 8GB or higher USB stick into your PC. Format the USB to FAT32 or exFAT before installation. Formatting will ERASE ALL DATA on the USB. (Right click the USB > Format > File System: FAT32 > Quick Format > Start.)\n**2.** Download the Windows MCT (Media Creation Tool) from the link above.\n**3.** Run the MCT. Select "Create installation media for another PC." Follow the prompts to select your USB flash drive as your media and create the installer.\n**4.** Once complete, your USB is now ready to install Windows on another PC. Power down that PC. Insert the USB installer. Boot the PC.\n**WARNING:** When installing Windows on a new PC, ensure only one drive (the drive you want the OS on) is plugged in. Unplug all other drives prior to installing Windows.')
        .setColor(client.embedColor)
        .setFooter('cloned from discord.gg/buildapc', 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp');
        message.channel.send({embeds: [embed]})
	},
	name: 'win',
	hidden: true
};
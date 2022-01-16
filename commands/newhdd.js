module.exports = {
	run: (client, message, args) => {
        const embed = new client.embed()
        .setTitle('How to set up a new drive')
        .setDescription("If you recently installed a new drive and it does not show in File Explorer, perform the following steps:\n**1.** Right click on the start menu, click Disk Management.\n**2.** Right click under the black bar new drive labeled 'Unallocated' and select 'New Simple Volume'.\n**3.** Run through the prompts to initialize the drive disk using GPT (GUID Partition Table).\n**4.** Continue and finish the prompts specifying the volume size, drive letter, volume name, and perform a quick format using the NTFS file system.")
        .setColor(client.embedColor)
        .setFooter('cloned from discord.gg/buildapc', 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp');
        message.channel.send({embeds: [embed]})
	},
	name: 'newdrive',
    description: 'How to set up a new drive',
    category: 'Real Computers',
    alias: ['newssd', 'newhdd']
};
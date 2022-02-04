module.exports = {
    run: (client, message, args) => {
        const embed = new client.embed()
        .setTitle(`How to use Display Driver Uninstaller`)
        .setDescription('Download DDU from Guru3d and download the latest driver for your GPU from Nvidia, AMD, or Intel from their respective download pages. Do not start DDU yet. Start Windows into Safe mode. To boot into safe mode, click on the start menu, click the power icon, hold shift and keep holding it, and then click restart. You should arrive at a blue screen with multiple options. Click on "Troubleshoot," "Advanced Options," "Startup Settings," and click on "Restart." Once you have rebooted into safe mode, run DDU and click on clean and restart. Install driver once windows boots normally.\n**Display Driver Uninstaller**: http://www.guru3d.com/files-details/display-driver-uninstaller-download.html\n**Guide**: https://www.youtube.com/watch?v=bP-2B14Nckw&t=83s')
        .setColor(client.embedColor)
        .setFooter('cloned from discord.gg/buildapc', 'https://cdn.discordapp.com/icons/286168815585198080/a_e1016a9b8d8f7c97dafef6b655e0d1b1.webp');
        message.reply({embeds: [embed], allowedMentions: { repliedUser: false }})
    },
    name: 'ddu',
    description: 'How to use Display Driver Uninstaller',
    category: 'Real Computers'
};
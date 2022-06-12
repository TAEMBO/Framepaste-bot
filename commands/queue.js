const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("displays the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page number of the queue").setMinValue(1)),
    run: async(client, interaction) => {
        await interaction.deferReply();
        const queue = client.music.getQueue(interaction.guildId)
        if (!queue || !queue.playing) return interaction.editReply("There are no songs playing.")
        const allPages = Math.ceil(queue.tracks.length / 10) ?? 1
        const page = (interaction.options.getNumber("page") ?? 1) - 1
        if(page > allPages) return await interaction.editReply(`Invalid Page. There are only a total of ${allPages} pages of songs`)
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`).join("\n")
        await interaction.editReply({embeds: [new MessageEmbed().setColor(client.config.embedColor).setDescription(`**Currently Playing**\n${(queue.current ? `\`[${queue.current.duration}]\` ${queue.current.title} -- <@${queue.current.requestedBy.id}>` : "None")}\n\n**Queue**\n${queueString}`).setFooter({text: `Page ${page + 1} of ${allPages + 1}`}).setThumbnail(queue.current.setThumbnail)]});
    }
}
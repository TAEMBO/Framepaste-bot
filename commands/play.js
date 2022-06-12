const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("play").setDescription("Plays music in the voice chat.").addStringOption((opt)=>opt.setName("song").setDescription("The name of the song.").setRequired(true)),
    run: async(client, interaction) => {
        interaction.deferReply();
        const { channel } = interaction.member.voice;
        if(!channel) return interaction.editReply({content: "Your not in a voice chat.", ephemeral: true});
        if(interaction.guild.me.voice.channel && interaction.guild.me.voice.channel.id !== channel.id) return interaction.editReply({content: "The bot is already playing music in another channel.", ephemeral: true});
        const queue = await client.music.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });
        if (!queue.connection) await queue.connect(interaction.member.voice.channel).catch((e)=>{return interaction.editReply({content: "I couldn't join your vc"}) && queue.disconnect()});
        const track = await client.music.search(interaction.options.getString("song"), {requestedBy: interaction.user});
        if (!track.tracks[0]) return await interaction.reply({ content: `❌ | Track **${interaction.options.getString("song")}** not found!` });
        queue.addTrack(track.tracks[0]);
        if(!queue.playing) queue.play();
        interaction.editReply({embeds: [new MessageEmbed().setColor(client.config.embedColor).setDescription(`**[${track.tracks[0].title}](${track.tracks[0].url})** has been added to the Queue`).setThumbnail(track.tracks[0].thumbnail).setFooter({ text: `Duration: ${track.tracks[0].duration}`}).setColor(client.config.color)]});
    }
}

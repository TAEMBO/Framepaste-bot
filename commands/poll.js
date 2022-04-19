const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton, Message} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll')
        .addStringOption(content => content
            .setName('content')
            .setDescription('The poll content')
            .setRequired(true)),
    run: (client, interaction) => {
        let moderators = [];
        let votesUp = 0;
        let votesDown = 0;

        const content = interaction.options.getString('content')

        interaction.guild.roles.cache.get('858077018732888084').map((user) => {
            moderators.push(user)
        })

        if(!moderators.includes(interaction.user)) return interaction.reply({content: 'You aren\'t allowed to make polls', ephemeral: true})

        const pollEmbed = new MessageEmbed()
            .setTitle('New poll')
            .setDescription('The poll will automatically end in 15 minutes')
            .addFields({name: 'Poll content', value: `${content}`}, {name: 'Votes', value: `Votes to yes: ${votesUp}\nVotes to no: ${votesDown}`})
            .setTimestamp()

        const voteButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('voteup')
                    .setLabel('Vote YES')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('votedown')
                    .setLabel('Vote NO')
                    .setStyle('DANGER')
            )

        interaction.reply({embeds: [pollEmbed], components: [voteButtons]})

        const Collector = interaction.channel.createMessageComponentCollector({time: 900000});

        const contestants = [];

        Collector.on('collect', i => {
            if(contestants.includes(i.user.id)) return i.reply({content: 'You already voted', ephemeral: true})
            if(i.customId === 'voteup'){
                votesUp++
                interaction.editReply({embeds: [pollEmbed]}).then(() => {
                    contestants.push(i.user.id)
                })
            }
            if(i.customId === 'votedown'){
                votesDown++
                interaction.editReply({embeds: [pollEmbed]}).then(() => {
                    contestants.push(i.user.id)
                })
            }
        })

        Collector.on('end', () => {
            interaction.deleteReply().then(() => {
                let moderators = [];
                let votesUp = 0;
                let votesDown = 0;
                const contestants = [];
            })
        })
    }
}
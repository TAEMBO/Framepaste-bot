
module.exports = {
    run: (client, message, args) => {
        if(!args[1]) return message.reply({content: 'You must include a trend to search.', allowedMentions: {repliedUser: false}});
        const embed = new client.embed()
            .setTitle('trend')
        const trend = args[1]
        if(trend.length <3) return message.reply({content: 'A trend must be a minimum of 3 letters.', allowedMentions: {repliedUser: false}});
        const trendmembers = message.guild.members.cache.filter(member => member.displayName.toLowerCase().includes(trend)).map(member => member.toString()).join(" ")
        if(!trendmembers){
            embed.addField(args[1],'No users follow this trend (bozo)')
            message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
            return;
        }else if(trendmembers.length > 6000){
                message.reply('This trend is too big')
                return;
            }else {
                embed.setColor(client.config.embedColor)
                embed.setTitle("Trend")
                embed.addField(args[1], trendmembers)
                message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }

    },
    name: 'trend',
    usage: ["search term"],
    description: 'Search for users with a matching username or nickname',
};
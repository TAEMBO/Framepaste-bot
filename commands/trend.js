
module.exports = {
    run: (client, message, args) => {
        if(!args[1]){message.reply("Send a trend"); return;}
        const embed = new client.embed()
            .setTitle('trend')
        const trend = args[1]
        if(trend.length <3){message.channel.send("A trend must be minimum 3 letters"); return;}
        const trendmembers = message.guild.members.cache.filter(member => member.displayName.toLowerCase().includes(trend)).map(member => member.toString()).join(", ")
        if(!trendmembers){
            embed.addField(args[1],'No users follow this trend (bozo)')
            message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
            return;
        }else if(trendmembers.length > 6000){
                message.reply('This trend is too big')
                return;
            }else {
                embed.setColor('#000fff')
                embed.setTitle("Trend")
                embed.addField(args[1], trendmembers)
                message.reply({embeds: [embed], allowedMentions: {repliedUser: false}})
        }

    },
    name: 'trend',
    description: 'Trend',
    category: 'Misc'
};
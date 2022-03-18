module.exports = {
    name: "messageReactionAdd",
    giveaway: false,
    tracker: false,
    frs: false,
    execute: async (client, reaction, user) => {
        const message = await client.channels.cache.get(reaction.message.channelId).messages.fetch(reaction.message.id).catch((e)=>{return null});
        const channel = message.channel;

        // #starboard wrong emoji 
        if (reaction.emoji.name !== '⭐' && channel.id === client.config.mainServer.channels.starboard) {
            return reaction.remove();
        }

        // non star emoji or bot
        if (reaction.emoji.name !== '⭐' || user.bot) return;

        // starred own interaction
        if ((message.author.id === user.id || message.embeds[0]?.footer?.text.includes(user.id)) && !client.selfStarAllowed) {
            reaction.users.remove(user.id);
            return message.channel.send(user.toString() + ', You can\'t star your own message.').then(x => setTimeout(() => x.delete(), 6000));
        }
        // star increment
        if (channel.id === client.config.mainServer.channels.starboard) {
            if (!message.embeds[0]) return;
            const footer = message.embeds[0].footer.text;
            client.starboard.increment({ message: { id: footer.slice(4, footer.indexOf(',')) } });
        } else {
            client.starboard.increment({ message });
        }
    }
}
module.exports = {
    name: "messageReactionRemove",
    giveaway: false,
    tracker: false,
    execute: async (client, reaction, user) => {
            const message = reaction.message;

            // decrement only if self starring is not allowed and a person (not bot) removed reaction star. otherwise return
            if (reaction.emoji.name !== '⭐' || user.bot || ((message.author.id === user.id || message.embeds[0]?.footer?.text.includes(user.id)) && !client.selfStarAllowed)) return;
    
            // decrement
            if (message.channel.id === client.config.mainServer.channels.starboard) {
                if (!message.embeds[0]) return;
                const footer = message.embeds[0].footer.text;
                client.starboard.decrement({ message: { id: footer.slice(4, footer.indexOf(',')) } });
            } else {
                client.starboard.decrement({ message });
            }
    }
}
module.exports = {
    name: "messageReactionRemove",
    giveaway: false,
    tracker: false,
    node: false,
    execute: async (client, reaction, user) => {
        if (reaction.message.partial) {
            if (!client.config.botSwitches.reactionRoles) return;
            try {
                await reaction.message.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message: ', error);
            }
        // Giveaways
        if (reaction.emoji.name === '🎉' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.remove('903649265224663121', 'Reaction Roles')}
        // Streams
        if (reaction.emoji.name === '🎥' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.remove('919795464323338280', 'Reaction Roles')}
        // Skill issue infected
        if (reaction.emoji.name === 'bad' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.remove('918748679567982602', 'Reaction Roles')}
        // Free games
        if (reaction.emoji.name === '🎮' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.remove('920049508291854336', 'Reaction Roles')}
        // Politics
        if (reaction.emoji.name === 'obamadiscord' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.remove('930193532214444093', 'Reaction Roles')}
        } else {
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
}
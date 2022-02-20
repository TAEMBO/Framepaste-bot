module.exports = {
    name: "messageReactionAdd",
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
            member.roles.add('903649265224663121', 'Reaction Roles')}
        // Streams
        if (reaction.emoji.name === '🎥' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.add('919795464323338280', 'Reaction Roles')}
        // Skill issue infected
        if (reaction.emoji.name === 'bad' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.add('918748679567982602', 'Reaction Roles')}
        // Free games
        if (reaction.emoji.name === '🎮' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.add('920049508291854336', 'Reaction Roles')}
        // Politics
        if (reaction.emoji.name === 'obamadiscord' && reaction.message.id === '928716338954919946') {
            const member = await reaction.message.guild.members.fetch(user.id)
            member.roles.add('930193532214444093', 'Reaction Roles')}
        } else {
        const message = reaction.message;
        const channel = message.channel;

        // #starboard wrong emoji 
        if (reaction.emoji.name !== '⭐' && channel.id === client.config.mainServer.channels.starboard) {
            return reaction.remove();
        }

        // non star emoji or bot
        if (reaction.emoji.name !== '⭐' || user.bot) return;

        // starred own message
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
}
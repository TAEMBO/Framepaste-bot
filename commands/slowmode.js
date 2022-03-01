module.exports = { 
	run: (client, message, args) => {
		if(!client.hasModPerms(client, message.member)) return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }})
        if(!args[1]) return message.reply({content: 'You need to include a duration to set.', allowedMentions: {repliedUser: false}})
        if(isNaN(args[1])) return message.reply({content: 'You must include a number.', allowedMentions: {repliedUser: false}})
        if(args[1].includes('.')) return message.reply({content: 'Number must be a whole number.', allowedMentions: {repliedUser: false}})
        if(args[1] > 21600) return message.reply({content: 'The slowmode limit is 6 hours (\`21600\` seconds).', allowedMentions: {repliedUser: false}})
        message.channel.setRateLimitPerUser(args[1], `Done by ${message.author.tag}`)
        if(args[1] === '0') {
            message.reply({content: 'Slowmode removed.', allowedMentions: {repliedUser: false}})
        } else if (args[1] === '1') {
            return message.reply({content: `Slowmode set to \`${args[1]}\` second.`, allowedMentions: {repliedUser: false}})
        } else return message.reply({content: `Slowmode set to \`${args[1]}\` seconds.`, allowedMentions: {repliedUser: false}})
	},
	name: 'slowmode',
    category: 'Moderation',
    alias: ['sm'],
	description: 'Sets a slowmode amount for the channel executed in',
    usage: ['time in seconds']
};
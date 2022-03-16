module.exports = { 
    run: async (client, message, args) => {
        const msg = await message.reply({content: "Ping:", allowedMentions: {repliedUser: false}});
        const time = msg.createdTimestamp - message.createdTimestamp; msg.edit({content: `Ping: \`${time}\`ms`, allowedMentions: {repliedUser: false}});
    },
    name: 'ping',
    description: 'Bot\'s latency',
    category: 'Bot'
};
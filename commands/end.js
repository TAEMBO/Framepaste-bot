module.exports = {
    run: async (client, message, args) => {
        if (message.guild.id !== client.config.mainServer.id) {
            return message.reply({content: 'Wrong server.', allowedMentions: { repliedUser: false }})
        }
        if (!client.hasModPerms(client, message.member)) {
            return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }});
        }
        if (!args[0]) {
            return message.channel.send(':boom: Uh oh, I couldn\'t find that message! Try again!');
        }

        let giveaway =
            client.giveawaysManager.giveaways.find((g) => g.prize === args.slice(1).join(' ')) ||
            client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

        if (!giveaway) {
            return message.channel.send(':boom: Hm. I can\'t seem to find a giveaway for `' + args.slice(1).join(' ') + '`.');
        }
        client.giveawaysManager.edit(giveaway.messageID, {
            setEndTimestamp: Date.now()
        })
            .then(() => {
                message.channel.send('Giveaway will end in less than ' + (client.giveawaysManager.options.updateCountdownEvery / 1000) + ' seconds...');
            })
            .catch((e) => {
                if (e.startsWith(`Giveaway with message ID ${giveaway.messageID} has already ended.`)) {

                    message.channel.send('This giveaway has already ended!');

                } else {
                    console.error(e);
                    message.channel.send('An error occurred...');
                }
            });
    },
    name: "end",
    description: "Ends a giveaway.",
    usage: ['message ID'],
    category: "Giveaways"
};
const ms = require('ms');

module.exports = {
    run: async (client, message, args) => {
        if (message.guild.id !== client.config.mainServer.id) {
            return message.reply({content: 'Wrong server.', allowedMentions: { repliedUser: false }})
        }
        if (!client.hasModPerms(client, message.member)) {
            return message.reply({content: `You need the **${message.guild.roles.cache.get(client.config.mainServer.roles.moderator).name}** role to use this command`, allowedMentions: { repliedUser: false }});
        }
        let giveawayChannel = message.mentions.channels.first();
        if (!giveawayChannel) {
            return message.channel.send(':boom: Uh oh, I couldn\'t find that channel! Try again!');
        }

        let giveawayDuration = ms(args[2]);
        if (!giveawayDuration || isNaN(giveawayDuration)) {
            return message.channel.send(':boom: Hm. you haven\'t provided a duration. Can you try again?');
        }
        
        let giveawayNumberWinners = parseInt(args[3]);
        if (isNaN(giveawayNumberWinners) || (giveawayNumberWinners <= 0)) {
            return message.channel.send(':boom: Uh... you haven\'t provided the amount of winners.');
        }

        let giveawayPrize = args.slice(4).join(' ');
        if (!giveawayPrize) {
            return message.channel.send(':boom: Oh, it seems like you didn\'t give me a valid prize!');
        }
        if (!client.config["Giveaway_Options"].showMention && client.config["Giveaway_Options"].giveawayRoleID && client.config["Giveaway_Options"].giveawayMention) {

            giveawayChannel.send(`<@&${client.config["Giveaway_Options"].giveawayRoleID}>`).then((msg) => msg.delete({ timeout: 1000 }))
            client.giveawaysManager.start(giveawayChannel, {
                duration: giveawayDuration,
                prize: giveawayPrize,
                winnerCount: giveawayNumberWinners,
                hostedBy: client.config["Giveaway_Options"].hostedBy ? message.author : null,
                messages: {
                    giveaway: "🎉 GIVEAWAY 🎉",
                    giveawayEnded: "🎉 GIVEAWAY ENDED 🎉",
                    timeRemaining: "Time remaining: {duration}!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won the {prize}!",
                    embedFooter: "Giveaways",
                    noWinner: "Not enough entrants to determine a winner!",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            });

        } else if (client.config["Giveaway_Options"].showMention && client.config["Giveaway_Options"].giveawayRoleID && client.config["Giveaway_Options"].giveawayMention) {

            client.giveawaysManager.start(giveawayChannel, {
                duration: giveawayDuration,
                prize: giveawayPrize,
                winnerCount: giveawayNumberWinners,
                }
            );

        } else if (!client.config["Giveaway_Options"].showMention && !client.config["Giveaway_Options"].giveawayRoleID && client.config["Giveaway_Options"].giveawayMention) {
            giveawayChannel.send(`@everyone`).then((msg) => msg.delete({ timeout: 1000 }))
            client.giveawaysManager.start(giveawayChannel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: parseInt(giveawayNumberWinners),
                hostedBy: client.config["Giveaway_Options"].hostedBy ? message.author : null,
                messages: {
                    giveaway: ":tada: **GIVEAWAY** :tada:",
                    giveawayEnded: ":tada: **GIVEAWAY ENDED** :tada:",
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won the **{prize}**!",
                    embedFooter: "Giveaways",
                    noWinner: "Not enough entrants to determine a winner!",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            });

        } else if (client.config["Giveaway_Options"].showMention && !client.config["Giveaway_Options"].giveawayRoleID && client.config["Giveaway_Options"].giveawayMention) {
            client.giveawaysManager.start(giveawayChannel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: parseInt(giveawayNumberWinners),
                hostedBy: client.config["Giveaway_Options"].hostedBy ? message.author : null,
                messages: {
                    giveaway: (client.config["Giveaway_Options"].showMention ? `@everyone\n\n` : "") + ":tada: **GIVEAWAY** :tada:",
                    giveawayEnded: (client.config["Giveaway_Options"].showMention ? `@everyone\n\n` : "") + ":tada: **GIVEAWAY ENDED** :tada:",
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won the **{prize}**!",
                    embedFooter: "Giveaways",
                    noWinner: "Not enough entrants to determine a winner!",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            });
        } else if (!client.config["Giveaway_Options"].giveawayMention) {
            client.giveawaysManager.start(giveawayChannel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: parseInt(giveawayNumberWinners),
                hostedBy: client.config["Giveaway_Options"].hostedBy ? message.author : null,
                messages: {
                    giveaway: ":tada: **GIVEAWAY** :tada:",
                    giveawayEnded: ":tada: **GIVEAWAY ENDED** :tada:",
                    timeRemaining: "Time remaining: **{duration}**!",
                    inviteToParticipate: "React with 🎉 to participate!",
                    winMessage: "Congratulations, {winners}! You won the **{prize}**!",
                    embedFooter: "Giveaways",
                    noWinner: "Not enough entrants to determine a winner!",
                    hostedBy: "Hosted by: {user}",
                    winners: "winner(s)",
                    endedAt: "Ended at",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            });
        }


        message.channel.send(`:tada: Done! The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}!`);
    },
    name: "start",
    description: "Starts a giveaway.",
    usage: ['channel', 'duration', 'winners', 'prize'],
    category: "Giveaways",
};
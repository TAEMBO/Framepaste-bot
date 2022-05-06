const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

module.exports = {
    run: async (client, interaction) => {

        if (!client.hasModPerms(client, interaction.member)) {
            return interaction.reply({content: `You need the <@&${client.config.mainServer.roles.mod}> role to use this command.`, allowedMentions: {roles: false}});
        }
        const giveawayChannel = interaction.options.getChannel("channel");

        const giveawayDuration = ms(interaction.options.getString("time"));
        if (isNaN(giveawayDuration)) {
            return interaction.channel.send(':boom: Hm. you haven\'t provided a duration. Can you try again?');
        }
        
        const giveawayNumberWinners = interaction.options.getInteger("winners");
        const giveawayPrize = interaction.options.getString("prize");
        if (!client.config["Giveaway_Options"].showMention && client.config["Giveaway_Options"].giveawayRoleID && client.config["Giveaway_Options"].giveawayMention) {

            giveawayChannel.send(`<@&${client.config["Giveaway_Options"].giveawayRoleID}>`).then((msg) => msg.delete({ timeout: 1000 }))
            client.giveawaysManager.start(giveawayChannel, {
                duration: giveawayDuration,
                prize: giveawayPrize,
                winnerCount: giveawayNumberWinners,
                hostedBy: client.config["Giveaway_Options"].hostedBy ? interaction.user : null,
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
                hostedBy: client.config["Giveaway_Options"].hostedBy ? interaction.user : null,
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
                hostedBy: client.config["Giveaway_Options"].hostedBy ? interaction.user : null,
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
                hostedBy: client.config["Giveaway_Options"].hostedBy ? interaction.user : null,
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
        const channel = client.channels.resolve(giveawayChannel)

        channel.send('<@&903649265224663121>').then(x => setTimeout(() => x.delete(), 500)) //giveaway role that gets pinged, then deleted for a cleaner look
        interaction.reply(`:tada: Done! The giveaway for the \`${giveawayPrize}\` is starting in ${giveawayChannel}!`);
    },
    data: new SlashCommandBuilder().setName("start").setDescription("Starts a giveaway!").addChannelOption((opt)=>opt.setName("channel").setDescription("The channel to host the giveaway in.").setRequired(true)).addStringOption((opt)=>opt.setName("time").setDescription("The time for the giveaway.").setRequired(true)).addIntegerOption((opt)=>opt.setName("winners").setDescription("The amount of winners for this giveaway.").setRequired(true)).addStringOption((opt)=>opt.setName("prize").setDescription("The prize for the giveaway.").setRequired(true))
};
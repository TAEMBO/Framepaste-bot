module.exports = {
    name: "giveawayReactionRemoved",
    giveaway: true,
    tracker: false,
    node: false,
    execute: async (giveaway, member, reaction) => {
		console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
    }
}
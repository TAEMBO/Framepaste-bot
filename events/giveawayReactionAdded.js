module.exports = {
    name: "giveawayReactionAdded",
    giveaway: true,
    tracker: false,
    execute: async (giveaway, member, reaction) => {
		console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
  }
}
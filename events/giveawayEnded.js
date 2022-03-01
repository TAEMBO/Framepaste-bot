module.exports = {
    name: "giveawayEnded",
    giveaway: true,
    tracker: false,
    frs: false,
    execute: async (giveaway, winners) => {
		console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
    }
}
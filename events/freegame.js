module.exports = {
    name: "free_games",
    frs: true,
    giveaway: false,
    tracker: false,
    execute: async (client, frs, games) => {
        const gameData = await frs.getGameDetails(games, "info", {
            language: ["en-US"]
        });
    }
}
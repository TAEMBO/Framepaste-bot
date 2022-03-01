module.exports = {
    name: "voiceStateUpdate",
    tracker: false,
    giveaway: false,
    frs: false,
    execute: async (client, oldState, newState) =>{
        const memberRole = oldState.guild.roles.cache.get(client.config.mainServer.roles.VCRole);
        if (!memberRole) return;
        if (newState.channelID) {
            newState.member.roles.add(memberRole);
        } else if (oldState.channelID && !newState.channelID) {
            newState.member.roles.remove(memberRole);
        }
    }
}
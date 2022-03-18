module.exports = {
    name: "inviteCreate",
    tracker: false,
    giveaway: false,
    frs: false,
    execute: async (client, invite) =>{
        client.invites.set(invite.code, {uses: 0, creator: invite.inviter.id})
    }
}
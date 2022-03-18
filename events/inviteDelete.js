module.exports = {
    name: "inviteCreate",
    tracker: false,
    giveaway: false,
    frs: false,
    execute: async (client, invite) =>{
        client.invites.delete(invite.code)
    }
}
module.exports = {
    name: "inviteCreate",
    tracker: false,
    giveaway: false,
    frs: false,
    execute: async (client, invite) =>{
        const newInvites = await invite.guild.invites.fetch();
        newInvites.forEach(inv => client.invites.set(inv.code, {uses: inv.uses, creator: inv.inviter.id}));
    }
}
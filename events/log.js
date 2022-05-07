module.exports = {
    name: "log",
    tracker: false,
    giveaway: false,
    frs: false,
    execute: async (client, data) =>{
        const channel = await client.channels.fetch(client.config.mainServer.channels.modlogs);
        channel.send(data);
        
    }
}
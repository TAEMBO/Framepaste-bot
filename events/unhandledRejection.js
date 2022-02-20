const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unhandledRejections",
    giveaway: false,
    tracker: false,
    node: true,
    execute: async (client, error) => {
        const channel = await client.channels.fetch(require("../config.json").mainServer.channels.modlogs);
        channel.send({content: `${client.config.eval.whitelist.map(x=>`<@${x}>`.join(", "))}`, embeds: [new MessageEmbed().setTitle("Error Caught!").setColor("#420420").setDescription(`Error: \`${error.message}\`\nStack: \`${`${error.stack}`.slice(0, 2500)}\``)]})
    }
}
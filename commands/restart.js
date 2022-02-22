
module.exports = {
  run: (client, message) => {
    if(!message.member.roles.cache.has("858077018732888084" || "914646059714768906")){
      message.channel.send("You can't do that bingus")
      return;
    }

    function timeFunction() {
      message.channel.send("bot restarting.")
      setTimeout(function(){resetBot(message.channel);}, 5000);
    }

    timeFunction();

    async function resetBot(channel) {
      channel.send('Bot restarted.')
          .then(msg => client.destroy())
          .then(() => client.login(client.config.token), client.login(client.config.modmailBotToken));
      await client.channels.fetch(require("../config.json").mainServer.channels.modlogs).then((channel)=>{channel.send(`:warning: Bot restarted :warning:\n${client.config.eval.whitelist.map(x => `<@${x}>`).join(' ')}`)});
            }

  },
    name: 'restart'
};
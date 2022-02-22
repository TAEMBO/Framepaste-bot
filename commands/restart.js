const { exec } = require("child_process");
module.exports = {
  run: (client, message) => {
    if(!message.member.roles.cache.has("858077018732888084" || "914646059714768906")){
      message.channel.send("You can't do that bingus")
      return;
    }

    message.channel.send("Bot is restarting").then(async ()=> exec("pm2 restart 0"))

  },
    name: 'restart',
    category: 'Moderation'
};
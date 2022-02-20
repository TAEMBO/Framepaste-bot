module.exports = {
    run: (client, message, args) => {
        const { reddit } = require("@kindl3d/reddit.js")
        const { MessageEmbed } = require("discord.js")
        let target = "memes"
        let loopamount = 0
        redditpost(target)
        function redditpost(target) {
                reddit(target).then(data => {
                    const redditembed = new MessageEmbed()
                        .setColor('faff04')
                        .setTitle(data.title)
                        .setImage(data.url)
                        .setDescription(`by u/${data.author}`)
                    message.reply({embeds: [redditembed], allowedMentions: { repliedUser: false }})
                })}},
    name: 'memesfromreddit',
    description: 'Searches some random meme from r/memes',
    alias: ['meem']
}

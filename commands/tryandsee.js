module.exports = {
    run: (client, message, args) => {
        message.delete()
        message.channel.send("https://tryitands.ee/")
    },
    name: 'tryandsee',
    hidden: true
};
module.exports = {
    run: (client, message, args) => {
        exec("git commit -m \"merge\""); exec("git pull")
        message.reply({content: 'Pulling available updates...', allowedMentions: {repliedUser: false}})
    },
    name: 'pull',
    description: 'Pull GitHub updates to bot',
    hidden: true
};
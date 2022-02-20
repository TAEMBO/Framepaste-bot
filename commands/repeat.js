module.exports = {
    run: (client, message, args) => {
        let messagetosend = args.slice(1).join(' ');
        message.reply(messagetosend);
    },
    name: 'repeat',
    description: 'Repeats a message',
    category: 'Fun',
    alias: ['rpt']
}
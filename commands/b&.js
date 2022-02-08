module.exports = {
    run: (client, message, args) => {
        message.delete().catch(err => console.log('couldnt delete message when doing b& because', err.message));
        let member = message.content.split(" ")[1]
        let    member2 = member.toString().replace(/[\<>@#&!]/g, "")
        console.log(member2)

        if (!args[1]) {
            message.channel.send('You received an honorary ban!')
            return;
        }
        if(isNaN(member2)){
            message.channel.send(`You received an honorary ban!`)
            return;
        }
        if (args[1]) {
            message.channel.send(`<@${member2.toString()}> has received an honorary ban!`)}
        return;
    },
    name: 'b&',
    usage: ['userID'],
    hidden: true
};
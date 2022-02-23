module.exports = {
    run: (client, message, args) => {
        const { MessageEmbed } = require("discord.js")
        let msg = args.slice(1).join(" ");
        const answers = ['Without a doubt. Nah, I’m just messing with you.', 'My sources say no.', 'They also tell me they hate you.', 'Yes, definitely. Unless...', 'As If', 'Ask Me If I Care', 'Dumb Question Ask Another', 'Forget About It', 'In Your Dreams', 'Not A Chance', 'Obviously', 'Oh Please', 'Sure', 'That\'s Ridiculous', 'Well Maybe', 'What Do You Think?', 'Who Cares?', 'Yeah Right', 'You Wish', 'You\'ve Got To Be Kidding...', 'Yes', 'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];

        const Randomanswer = Math.floor(Math.random() * answers.length);

        if(!args[1]){
            message.reply({content: 'You didn\'t ask a question you moron.', allowedMentions: { repliedUser: false }});
            return;
        }

        if(msg.length <= 4){
            message.reply({content: 'Ask a real question dumb ass', allowedMentions: { repliedUser: false }});
            return;
        }

        // noinspection CommaExpressionJS
        const eightballembed = new MessageEmbed()
            .setTitle("8Ball")
            .setDescription(`> ${msg}\n\n**${Randomanswer, answers[Randomanswer]}**`)
            .setColor(client.embedColor)

            message.reply({embeds: [eightballembed], allowedMentions: { repliedUser: false }});
},
    name: 'eightball',
    alias: ['8ball'],
    usage: ['8ball'],
    category: 'Fun',
    description: 'You ask a question and it will answer you with a premade array.',
    shortDescription: 'Answers your question.'
}
const {SlashCommandBuilder} = require("@discordjs/builders");
module.exports = {
    run: (client, interaction) => {
        const { MessageEmbed } = require("discord.js");
        const answers = ['Without a doubt. Nah, I’m just messing with you.', 'My sources say no.', 'They also tell me they hate you.', 'Yes, definitely. Unless...', 'As If', 'Ask Me If I Care', 'Dumb Question Ask Another', 'Forget About It', 'In Your Dreams', 'Not A Chance', 'Obviously', 'Oh Please', 'Sure', 'That\'s Ridiculous', 'Well Maybe', 'What Do You Think?', 'Who Cares?', 'Yeah Right', 'You Wish', 'You\'ve Got To Be Kidding...', 'Yes', 'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful', 'my dad said I cant answer that, try again later', '*yawn*'];
        const msg = interaction.options.getString("question");
        const Randomanswer = Math.floor(Math.random() * answers.length);

        if(msg.length <= 4){
            interaction.reply({content: 'Ask a real question, numb nut.', allowedMentions: { repliedUser: false }});
            return;
        }

        const eightballembed = new MessageEmbed()
            .setTitle("8Ball")
            .setColor(client.config.embedColor)

        if(msg === "possibleanswers"){
            let possibleanswers = "";
            answers.forEach(function (item){
                possibleanswers = possibleanswers + "`" + item + "`\n";
                return possibleanswers;
            })
            eightballembed.setTitle("8ball possible answers:")
            eightballembed.setDescription(possibleanswers)
        }else{
            eightballembed.setDescription(`> ${msg}\n\n**${Randomanswer, answers[Randomanswer]}**`)
        }

            interaction.reply({embeds: [eightballembed], allowedMentions: { repliedUser: false }});

},
    data: new SlashCommandBuilder().setName("8ball").setDescription("You ask a question and it will answer you from a premade array.").addStringOption((opt)=>opt.setName("question").setDescription("Your question to the bot.").setRequired(true)),
}
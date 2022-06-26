const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		if (client.games.has(interaction.channel.id)) {
			return interaction.reply(`There is already an ongoing game in this channel created by ${client.games.get(interaction.channel.id)}`);
		}
		client.games.set(interaction.channel.id, interaction.user.tag);
		await interaction.reply({content: `Game started!`, ephemeral: true});
		const ea = await interaction.followUp({content: `A hangman game has started!\nAnyone can guess letters or the full word by doing \`guess [letter or word]\``, fetchReply: true});
		const word = interaction.options.getString("word");
		const guessedWordsIndices = [];
		const guesses = [];
		let fouls = 0;
		let latestActivity = Date.now();
		let hiddenLetters = true;
		function wordUpdate() {
			const hideWordResult = hideWord();
			let winText = '';
			if (!hiddenLetters) {
				winText = `\nThe whole word has been revealed. The hangman game ends. The word was:\n\`\`\`\n${word}\n\`\`\``;
				client.games.delete(interaction.channel.id);
			}
			ea.reply(`A part of the word has been revealed. This what the word looks like now:\n\`\`\`\n${hideWordResult}\n\`\`\`` + winText);
		}
		function hideWord() {
			hiddenLetters = false;
			return word.split('').map((x, i) => {
				if (guesses.includes(x) || guessedWordsIndices.includes(i)) return x;
				else if (x === ' ') return ' ';
				else {
					hiddenLetters = true;
					return '_';
				}
			}).join(' ');
		}
		function guessLetter(letter) {
			latestActivity = Date.now();
			if (guesses.includes(letter)) return interaction.channel.send('That letter has been guessed already.');
			guesses.push(letter);
			if (!word.includes(letter)) {
				fouls++;
				checkFouls();
				return;
			}
			wordUpdate();
		}
		function guessWord(text) {
			latestActivity = Date.now();
			if (!word.includes(text)) {
				fouls++;
				checkFouls(true);
				return;
			}
			const guessedTextStartIndex = word.indexOf(text);
			const guessedTextCharIndices = Array.from(Array(text.length).keys());
			guessedWordsIndices.push(...guessedTextCharIndices.map(x => x + guessedTextStartIndex));
			wordUpdate();
		}
		const guessCollector = interaction.channel.createMessageCollector({});

		guessCollector.on('collect', guessMessage => {
			if(guessMessage.author.bot) return;
			if(guessMessage.content.toLowerCase().startsWith('guess')){
			const guess = guessMessage.content.slice(6).toLowerCase();
			if (!guess || guess.length === 0) return guessMessage.reply({content: 'You\'re using the \`guess\` command wrong. Get good.', allowedMentions: { repliedUser: false }});
			if (guess.length > 1) {
				guessWord(guess);
			} else {
				guessLetter(guess);
			}
		}
		});

		const interval = setInterval(() => {
			if (Date.now() > latestActivity + 5 * 60 * 1000 && client.games.has(interaction.channel.id)) {
				guessCollector.stop();
				client.games.delete(interaction.channel.id);
				interaction.channel.send('The hangman game has ended due to inactivity.');
				clearInterval(interval);
			}
		}, 5000);

		function checkFouls(textGuess) {
			const stages = [
				[
					'      ',
					'      ',
					'      ',
					'      ',
					'╭────╮',
					'╯    ╰'
				],
				[
					'      ',
					'      ',
					'  ┃   ',
					'  ┃   ',
					'╭─┸──╮',
					'╯    ╰'
				],
				[
					'  ┏   ',
					'  ┃   ',
					'  ┃   ',
					'  ┃   ',
					'╭─┸──╮',
					'╯    ╰'
				],
				[
					'  ┏   ',
					'  ┃   ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃   ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃ ⎔ ',
					'  ┃   ',
					' ┌┨   ',
					'╭┴┸──╮',
					'╯    ╰'
				],
				[
					'  ┏━┓ ',
					'  ┃ ⎔ ',
					'  ┃╶╂╴',
					' ┌┨ ^ ',
					'╭┴┸──╮',
					'╯    ╰'
				],
			];
			let loseText = '';
			if (fouls === 7) {
				loseText = `\nThe poor fella got hung. You lost the game. The word was:\n\`\`\`\n${word}\n\`\`\``;
				client.games.delete(interaction.channel.id);
				guessCollector.stop();
				clearInterval(interval);
			}
			ea.reply(`The word doesn\'t include that ${!textGuess ? 'letter' : 'piece of text'}.\nAn incorrect guess leads to the addition of things to the drawing. It now looks like this:\n\`\`\`\n${stages[fouls - 1].join('\n')}\n\`\`\`` + loseText);
		}
	},
	data: new SlashCommandBuilder().setName("hangman").setDescription("Starts a game of hangman!").addStringOption((opt)=>opt.setName("word").setDescription("The word to users have to try and guess.").setRequired(true))
};
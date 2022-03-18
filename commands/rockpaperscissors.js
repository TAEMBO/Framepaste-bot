const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	run: async (client, interaction) => {
		if (client.games.has(interaction.channel.id)) {
			return interaction.reply(`There is already an ongoing game in this channel created by ${client.games.get(interaction.channel.id)}`);
		}
		const players = [interaction.member];
		await interaction.reply(`Who wants to play Rock Paper Scissors with ${interaction.member.toString()}? Respond with "me". (60s)`);
		client.games.set(interaction.channel.id, interaction.user.tag);
		const filter = x => x.content.toLowerCase().startsWith('me');
		const opponentMessages = await interaction.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => {
			interaction.channel.send('Haha no one wants to play with you, lonely goblin.');
			client.games.delete(interaction.channel.id);
			});
		players[1] = opponentMessages.first()?.member;
		if (!players[1]) return interaction.channel.send('Something went wrong! You have no opponent.');
		await interaction.channel.send('You have 10 seconds to choose what you want to play. Respond with the full word, but do not send your interaction yet. The valid options are: Rock, Paper, and Scissors.');
		await new Promise((res, rej) => {
			setTimeout(() => {
				res();
			}, 10000);
		});
		await interaction.channel.send('10 seconds have passed. **Send your interaction NOW!** You have 2 seconds to send your interaction.');
		const plays = ['scissors', 'paper', 'rock'];
		let timeError = false;
		const filter2 = x => x.author.id === players[0].user.id
		let homePlay = interaction.channel.awaitMessages({ filter2, max: 1, time: 2000, errors: ['time']}).catch((err) => {
			interaction.channel.send(`${players[0].toString()} failed to play their move in time.`);
			timeError = true;
			return '';
		});
		const filter3 = x => x.author.id === players[1].user.id;
		let guestPlay = interaction.channel.awaitMessages({ filter3, max: 1, time: 2000, errors: ['time'] }).catch((err) => {
			interaction.channel.send(`${players[1].toString()} failed to play their move in time.`);
			timeError = true;
			return '';
		});
		const resolvedPlays = await Promise.all([homePlay, guestPlay]);
		if (timeError) {
			client.games.delete(interaction.channel.id);
			return;
		}
		homePlay = resolvedPlays[0];
		guestPlay = resolvedPlays[1];
		homePlay = plays.indexOf(homePlay.first()?.content.toLowerCase().split(' ')[0]);
		guestPlay = plays.indexOf(guestPlay.first()?.content.toLowerCase().split(' ')[0]);
		if (homePlay < 0 || guestPlay < 0) {
			client.games.delete(interaction.channel.id);
			return interaction.channel.send('One player failed to play a valid option.');
		}
		let winnerIndex;
		if (homePlay + 1 === guestPlay) winnerIndex = 0;
		if (guestPlay + 1 === homePlay) winnerIndex = 1;
		if (homePlay === 0 && guestPlay === 2) winnerIndex = 1;
		if (homePlay === 2 && guestPlay === 0) winnerIndex = 0;

		const homeEmojis = ['v', 'raised_hand', 'right_facing_fist'].map(x => ':' + x + ':');
		const guestEmojis = ['v', 'raised_back_of_hand', 'left_facing_fist'].map(x => ':' + x + ':');
		const arrows = ['arrow_right', 'arrow_left'].map(x => ':' + x + ':');
		if (winnerIndex !== undefined) {
			interaction.channel.send(`${homeEmojis[homePlay]} ${arrows[winnerIndex]} ${guestEmojis[guestPlay]}\n${players[winnerIndex].toString()} wins!`);
		} else {
			interaction.channel.send(`${homeEmojis[homePlay]} :left_right_arrow: ${guestEmojis[guestPlay]}\nIts a draw!`);
		}
		client.games.delete(interaction.channel.id);
	},
	data: new SlashCommandBuilder().setName("rps").setDescription("Starts a game of rock paper scissors.")
};
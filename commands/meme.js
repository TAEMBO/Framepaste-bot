const util = require('util');
const fs = require('fs');
const axios = require("axios");
const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

async function fetchPost(){
	const reddits = ["memes", "hardwarememes"];
	const memesrandom = Math.floor(Math.random() * reddits.length);
	const body = await axios.get(`https://www.reddit.com/r/${memesrandom, reddits[memesrandom]}/random.json`).catch((err)=>{return err});
	return body.data[0].data.children;
}
module.exports = {
	run: async (client, interaction) => {
		delete require.cache[require.resolve('../databases/memes.json')];
		const memes = new client.collection(Object.entries(require('../databases/memes.json')));
		const color = '#1decaf'
		const failed = () => interaction.followUp('You failed. The `meme add` process has ended.');
		const subCmd = interaction.options.getSubcommand();
		if(subCmd === "random") {
			await fetchPost().then(async (body) => {
				if (!body || !body[0].data.url.endsWith(".webp") && !body[0].data.url.endsWith(".jpg") && !body[0].data.url.endsWith(".png") && !body[0].data.url.endsWith(".gif")) {
					await fetchPost().then(async (bod) => {
						if (!bod || !bod[0].data.url.endsWith(".webp") && !bod[0].data.url.endsWith(".jpg") && !bod[0].data.url.endsWith(".png") && !bod[0].data.url.endsWith(".gif")) {
							interaction.reply("There was an error, retry the command.")
							return;
						}
						const redditembed = new client.embed()
							.setTitle(bod[0].data.title)
							.setColor(color)
							.setImage(bod[0].data.url)
							.setFooter({text: `${bod[0].data.ups} Upvotes`})

						interaction.reply({embeds: [redditembed]});
					})
					return;
				}
				const redditembed = new client.embed()
					.setTitle(body[0].data.title)
					.setColor(color)
					.setImage(body[0].data.url)
					.setFooter({text: `${body[0].data.ups} Upvotes`})

				interaction.reply({embeds: [redditembed]});
			})

			return;
		} else if (subCmd === "list") {
			const embed = new client.embed()
				.setTitle('Browse Memes')
				.setColor(color);
			if (memes.size > 0) {
				const memesPerPage = memes.size / 3;
				if (memesPerPage < 1) {
					embed.addField('\u200b', memes.map((x, key) => `\`${key}\` - ${x.name}\n`).join(''), true);
				} else {
					for (let i = 0; i < 3; i++) {
						embed.addField('\u200b', Array.from(memes).slice(Math.ceil(i * memesPerPage), Math.ceil((i + 1) * memesPerPage)).map(x => `\`${x[0]}\` - ${x[1].name}\n`).join(''), true);
					}
				}
			} else embed.setDescription('No memes have been added yet.');
			return interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		} else if (subCmd === 'add') {
				await interaction.reply('Creating your own meme...\nWhat is the name of your meme? (60s)');
				const meme = { adder: `${interaction.user.tag} (${interaction.user.id})`, timestamp: Date.now() };
				const filililil = x => x.author.id === interaction.user.id;
				meme.name = (await interaction.channel.awaitMessages({ filter: filililil, max: 1, time: 60000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.name) return failed();

				await interaction.followUp('Write a description for your meme. (120s)');
				const fililili = x => x.author.id === interaction.user.id;
				meme.description = (await interaction.channel.awaitMessages({ filter: fililili, max: 1, time: 120000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!meme.description) return failed();

				await interaction.followUp('Send a permanent URL to the meme image. (60s)');
				const fililil = x => x.author.id === interaction.user.id;
				const urlMessage = (await interaction.channel.awaitMessages({ filter: fililil, max: 1, time: 60000, errors: ['time'] }).catch(() => { }))?.first();
				if (urlMessage.content) {
					if (!['jpg', 'png', 'webp', 'gif', 'jpeg'].some(x => urlMessage.content.endsWith(x))) {
						return interaction.followUp('Your log-headed ass didn\'t notice that that\'s not an image url. Your mishap has terminated the `meme add` process. Thanks.');
					}
					meme.url = urlMessage.content;
				} else meme.url = urlMessage.attachments.first()?.url;
				if (!meme.url) return failed();

				await interaction.followUp('Is the creator of this meme a member of the Framepaste Discord server? Answer with y/n. (30s)');
				const filili = x => x.author.id === interaction.user.id;
				const onDiscord = (await interaction.channel.awaitMessages({ filter: filili, max: 1, time: 30000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				if (!onDiscord) return failed();

				meme.author = {};
				if (onDiscord.toLowerCase() === 'y') {
					meme.author.onDiscord = true;
					await interaction.followUp('What is the user ID of the creator of this meme? (60s)');
					const filil = x => x.author.id === interaction.user.id;
					meme.author.name = (await interaction.channel.awaitMessages({ filter: filil, max: 1, time: 60000, errors: ['time'] }).catch(() => { }))?.first()?.content;
					if (meme.author.name.startsWith('<')) return failed();
					if (meme.author.name === interaction.user.id) meme.adder = 'Self';
				} else if (onDiscord.toLowerCase() === 'n') {
					meme.author.onDiscord = false;
					await interaction.followUp('Supply a name for the creator of this meme, e.g. their username on the platform that you found this meme on. (90s)');
					const fili = x => x.author.id === interaction.user.id && ['y', 'n', 'cancel'].some(y => x.content.toLowerCase().startsWith(y));
					meme.author.name = (await interaction.channel.awaitMessages({ filter: fili, max: 1, time: 90000, errors: ['time'] }).catch(() => { }))?.first()?.content;
				} else {
					return failed();
				}
				if (!meme.author.name) return failed();

				const highestKey = Math.max(...Array.from(memes.keys()).map(x => parseInt(x)).filter(x => !isNaN(x)), ...Array.from(client.memeQueue.keys()).map(x => parseInt(x)), 0) + 2;
				const allNumbers = Array.from(Array(highestKey).keys()).slice(1);
				[...Array.from(memes.keys()).map(x => parseInt(x)).filter(x => !isNaN(x)), ...Array.from(client.memeQueue.keys()).map(x => parseInt(x))].forEach(usedKey => {
					allNumbers.splice(allNumbers.indexOf(usedKey), 1);
				});
				const key = allNumbers[0];

				client.memeQueue.set(key.toString(), meme);

				const embed = new client.embed()
					.setTitle('A meme with the following info has been created:')
					.setDescription('```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```\nInform one of the following people so they can approve your meme:\n' + client.config.eval.whitelist.map(x => '<@' + x + '>').join('\n') + '\nWith the following information: ":clap: meme :clap: review ' + key + '"')
					.setColor(color)
				return interaction.followUp({embeds: [embed], allowedMentions: { repliedUser: false }});
			} else if (subCmd === 'review') {
				if (!client.config.eval.whitelist.includes(interaction.user.id)) return interaction.reply('You\'re not allowed to do that.');
				const memeNumber = interaction.options.getInteger("meme")
				if (memeNumber) {
					const meme = client.memeQueue.get(`${memeNumber}`);

					const approve = () => {
						// add this meme to the collection
						memes.set(memeNumber, meme);

						// define meme database location
						let dir = __dirname.split('\\');
						dir.pop();
						dir = dir.join('\\');
						dir += '\\databases\\memes.json';

						// turn collection into JS object
						let memesJson = {};
						memes.forEach((x, key) => {
							memesJson[key] = x;
						});

						// turn object into json
						const json = JSON.stringify(memesJson);

						// rewrite memes.json
						fs.writeFileSync(dir, json);

						// remove this meme from the queue
						client.memeQueue.delete(`${memeNumber}`);

						// inform user
						interaction.reply({content: ':clap: Meme :clap: Approved!', allowedMentions: { repliedUser: false }});
						return;
					};

					const decline = () => {
						// remove this meme from the queue
						client.memeQueue.delete(`${memeNumber}`);

						// inform user
						interaction.reply({content: 'The submission has been declined and removed from the queue.', allowedMentions: { repliedUser: false }});
						return;
					};


					if (!meme) return interaction.reply({content: 'That meme doesn\'t exist.', allowedMentions: { repliedUser: false }});
					await interaction.reply({content: ':clap: Meme :clap: Review!\nDoes this look good to you? Respond with y/n. Type "cancel" to leave this meme in the queue. (120s)\n```js\n' + util.formatWithOptions({ depth: 1 }, '%O', meme) + '\n```\n' + (Math.random() < (1 / 3) ? '\`(TIP: You can add y/n to the end of the command to approve or decline a meme without seeing it.)\`\n' : '') + meme.url, allowedMentions: { repliedUser: false }, components: [new MessageActionRow().addComponents(new MessageButton().setLabel("Approve").setStyle("SUCCESS").setCustomId(`accept-${interaction.user.id}`), new MessageButton().setStyle("DANGER").setLabel("Decline").setCustomId(`decline-${interaction.user.id}`))]});
					const fil = x => x.user.id === interaction.user.id && [`accept-${interaction.user.id}`, `decline-${interaction.user.id}`].includes(i.customId);
					const approval = await interaction.channel.createMessageComponentCollector({filter: fil, max: 1, time: 30000});
					approval.on("collect", async (inter)=>{
					if (inter.customId === `accept-${interaction.user.id}`)
					approve();
				else if (inter.customId === `decline-${interaction.user.id}`)
					decline();
					})
					approval.on("end", async (colled, reason)=>{
						if(reason === "time") return interaction.editReply({content: "Process cancelled"}); 
					})
				} else {
					return interaction.reply({content: 'Memes pending review:\n```\n' + (client.memeQueue.size >= 1 ? client.memeQueue.map((meme, key) => `${key}. ${meme.name}`).join('\n') : 'None') + '\n```', allowedMentions: { repliedUser: false }});
				}
			} else if(subCmd === "view"){
			const query = interaction.options.getInteger("number")
			const meme = memes.get(`${query}`)
			if (!meme) return interaction.reply({content: 'That meme doesn\'t exist.', allowedMentions: { repliedUser: false }});
			const member = meme.author.onDiscord ? (await client.users.fetch(meme.author.name)) : undefined;
			const embed = new client.embed()
				.setTitle(meme.name)
				.setFooter({text: meme.description + ' | Added By: ' + (meme.adder || 'Unknown') + (meme.timestamp ? (` | ${client.formatTime(Date.now() - meme.timestamp, 1, { longNames: (!meme.adder || meme.adder === 'Self') })} ago`) : '')})
				.setColor(color)
			if (meme.url && meme.url.startsWith('http')) embed.setImage(meme.url);
			if (member) {
				embed.setAuthor({name: `By ${member.tag} (${member.id})`, iconURL: member.displayAvatarURL({ format: 'png', size: 256 })})
			} else {
				embed.setAuthor({name: 'By ' + meme.author.name})
			}
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
		}
	},
	data: new SlashCommandBuilder().setName("meme").setDescription("Fetch memes from r/memes if selected, or fetch member-made memes locally.")
	.addSubcommand((optt)=>optt.setName("list").setDescription("Lists all locally stored memes"))
	.addSubcommand((optt)=>optt.setName("random").setDescription("Fetches a random meme from reddit."))
	.addSubcommand((optt)=>optt.setName("add").setDescription("Add your own meme to our locally stored list."))
	.addSubcommand((optt)=>optt.setName("review").setDescription("Reviews a meme in queue.").addIntegerOption((opt)=>opt.setName("meme").setDescription("The number of the meme in queue").setRequired(false)))
	.addSubcommand((optt)=>optt.setName("view").setDescription("Views a local meme.").addIntegerOption((opt)=>opt.setName("number").setDescription("The number of the meme to view.").setRequired(true))),
	category: 'Fun'
};

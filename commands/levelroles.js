const { SlashCommandBuilder } = require("@discordjs/builders");
const d = require("discord.js")
module.exports = {
	run: async (client, interaction) => {

		// dailymsgs.json
		const dailyMsgs = require('../databases/dailyMsgs.json');

		// messages sent by each user, unordered array
		const messageCounts = Object.values(client.userLevels._content);

		// total amount of messages sent
		const messageCountsTotal = messageCounts.reduce((a, b) => a + b, 0);
		const subCmd = interaction.options.getSubcommand();
		if (subCmd === "stats") {

        // days since nov 28, 2021 when userlevels was created
            const timeActive = Math.floor((Date.now() - 1638138120305) / 1000 / 60 / 60 / 24);
			
			const data = dailyMsgs.map((x, i, a) => {
				const yesterday = a[i - 1] || [];
				return x[1] - (yesterday[1] || x[1]);
			}).slice(1).slice(-60);

			// handle negative days
			data.forEach((change, i) => {
				if (change < 0) data[i] = data[i - 1] || data[i + 1] || 0;
			});

			const maxValue = Math.max(...data);
			const maxValueArr = maxValue.toString().split('');

			const first_graph_top = Math.ceil(parseInt(maxValue) * 10 ** (-maxValueArr.length + 1)) * 10 ** (maxValueArr.length - 1);
			// console.log({ first_graph_top });

			const second_graph_top = Math.ceil(parseInt(maxValue) * 10 ** (-maxValueArr.length + 2)) * 10 ** (maxValueArr.length - 2);
			// console.log({ second_graph_top });

			const textSize = 32;

			const canvas = require('canvas');
			const fs = require('fs');
			const img = canvas.createCanvas(950, 450);
			const ctx = img.getContext('2d');

			const graphOrigin = [10, 50];
			const graphSize = [700, 360];
			const nodeWidth = graphSize[0] / (data.length - 1);
			ctx.fillStyle = '#36393f';
			ctx.fillRect(0, 0, img.width, img.height);

			// grey horizontal lines
			ctx.lineWidth = 3;

			let interval_candidates = [];
			for (let i = 4; i < 10; i++) {
				const interval = first_graph_top / i;
				if (Number.isInteger(interval)) {
					intervalString = interval.toString();
					const reference_number = i * Math.max(intervalString.split('').filter(x => x === '0').length / intervalString.length, 0.3) * (['1', '2', '4', '5', '6', '8'].includes(intervalString[0]) ? 1.5 : 0.67)
					interval_candidates.push([interval, i, reference_number]);
				}
			}
			// console.log({ interval_candidates });
			const chosen_interval = interval_candidates.sort((a, b) => b[2] - a[2])[0];
			// console.log({ chosen_interval });

			let previousY;

			ctx.strokeStyle = '#202225';
			for (let i = 0; i <= chosen_interval[1]; i++) {
				const y = graphOrigin[1] + graphSize[1] - (i * (chosen_interval[0] / second_graph_top) * graphSize[1]);
				if (y < graphOrigin[1]) continue;
				const even = ((i + 1) % 2) === 0;
				if (even) ctx.strokeStyle = '#2c2f33';
				ctx.beginPath();
				ctx.lineTo(graphOrigin[0], y);
				ctx.lineTo(graphOrigin[0] + graphSize[0], y);
				ctx.stroke();
				ctx.closePath();
				if (even) ctx.strokeStyle = '#202225';
				previousY = [y, i * chosen_interval[0]];
			}

			// 30d mark
			ctx.setLineDash([8, 16]);
			ctx.beginPath();
			const lastMonthStart = graphOrigin[0] + (nodeWidth * (data.length - 30));
			ctx.lineTo(lastMonthStart, graphOrigin[1]);
			ctx.lineTo(lastMonthStart, graphOrigin[1] + graphSize[1]);
			ctx.stroke();
			ctx.closePath();
			ctx.setLineDash([]);

			// draw points
			ctx.strokeStyle = '#5865F2';
			ctx.fillStyle = '#5865F2';
			ctx.lineWidth = 3;


			function getYCoordinate(value) {
				return ((1 - (value / second_graph_top)) * graphSize[1]) + graphOrigin[1];
			}

			let lastCoords = [];
			data.forEach((val, i) => {
				ctx.beginPath();
				if (lastCoords) ctx.moveTo(...lastCoords);
				if (val < 0) val = 0;
				const x = i * nodeWidth + graphOrigin[0];
				const y = getYCoordinate(val);
				ctx.lineTo(x, y);
				lastCoords = [x, y];
				ctx.stroke();
				ctx.closePath();

				// ball
				ctx.beginPath();
				ctx.arc(x, y, ctx.lineWidth * 1.2, 0, 2 * Math.PI)
				ctx.closePath();
				ctx.fill();

			});

			// draw text
			ctx.font = '400 ' + textSize + 'px sans-serif';
			ctx.fillStyle = 'white';

			// highest value
			const maxx = graphOrigin[0] + graphSize[0] + textSize;
			const maxy = previousY[0] + (textSize / 3);
			ctx.fillText(previousY[1].toLocaleString('en-US'), maxx, maxy);

			// lowest value
			const lowx = graphOrigin[0] + graphSize[0] + textSize;
			const lowy = graphOrigin[1] + graphSize[1] + (textSize / 3);
			ctx.fillText('0 msgs/day', lowx, lowy);

			// 30d
			ctx.fillText('30d ago', lastMonthStart, graphOrigin[1] - (textSize / 3));

			// time ->
			const tx = graphOrigin[0] + (textSize / 2);
			const ty = graphOrigin[1] + graphSize[1] + (textSize);
			ctx.fillText('time ->', tx, ty);

			const embed = new client.embed()
				.setTitle('Level Roles: Stats')
				.setDescription(`Level Roles was created ${timeActive} days ago. Since then, a total of ${messageCountsTotal.toLocaleString('en-US')} messages have been recorded in this server.`)
				.addFields({name: 'Top Users by Messages Sent', value: Object.entries(client.userLevels._content).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x, i) => `\`${i + 1}.\` <@${x[0]}>: ${x[1].toLocaleString('en-US')}`).join('\n') + `\n\Messages per day in ${client.guilds.cache.get(client.config.mainServer.id).name}:`})
				.setImage('attachment://dailymsgs.png')
				.setColor(client.config.embedColor)
			const yeahok = new d.MessageAttachment(img.toBuffer(), "dailymsgs.png")
			interaction.reply({embeds: [embed], files: [yeahok], allowedMentions: { repliedUser: false }});
			return;
		} else if (subCmd ==='perks') {

			const embed = new client.embed()
				.setTitle('Level Roles: Perks')
				.setDescription(`<@&${client.config.mainServer.roles.levels.three.id}> - Use External Sticker permissions\n<@&${client.config.mainServer.roles.levels.five.id}> - Permission to create public & private threads\n<@&${client.config.mainServer.roles.levels.seven.id}> - Use bot commands anywhere\n<@&${client.config.mainServer.roles.levels.nine.id}> - See all channels in <#931762419171201024>\n<@&${client.config.mainServer.roles.levels.ten.id}> - Hoisted\n<@&${client.config.mainServer.roles.levels.eleven.id}> - Hoisted\n<@&${client.config.mainServer.roles.levels.twelve.id}> - Hoisted\n<@&${client.config.mainServer.roles.levels.thirteen.id}> - Hoisted\n<@&${client.config.mainServer.roles.levels.fourteen.id}> - Hoisted\n<@&${client.config.mainServer.roles.levels.fifteen.id}> - Hoisted`)
				.setFooter({text: 'If a level role is not listed here, that means it comes with no perks.'})
				.setColor(client.config.embedColor)
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			return;

		} else if (subCmd === "nerd_stats") {
			
			// amount of users in messageCounts
			const userCount = messageCounts.length;

			// average messages sent by user
			const average = messageCountsTotal / userCount;
			// messages sent by median user
			const median = messageCounts.sort((a, b) => a - b)[Math.round(userCount / 2) - 1];
			// next interaction count milestone
			const milestone = client.userLevels._milestone();

			// days to get average from
			const dataLength = 30;

			// last 30d
			const lastMonth = dailyMsgs.slice(-(dataLength + 1));

			// if data is shorter than 30d (data is available from less than 30 truthy days), take that into account when calculating average
			const actualDataLength = lastMonth.filter(x => x).length - 1;

			// messages today relative to yesterday, daily change in msgs
			const msgsPerDay = lastMonth.slice(1).map((day, i) => {
				return day[1] - (lastMonth[i][1] || day[1]);
			});

			// handle negative days
			msgsPerDay.forEach((change, i) => {
				if (change < 0) msgsPerDay[i] = msgsPerDay[i - 1] || msgsPerDay[i + 1] || 0;
			});

			// average msgs per day
			const averageMsgsPerDay = msgsPerDay.reduce((a, b) => a + b, 0) / actualDataLength;

			// acceleration of messages per day
			function accelAverage(data) {
				return data.reduce((a, b) => a + b, 0) / data.length;
			}
			let accelPerHour = ((accelAverage(msgsPerDay.slice(-7)) - accelAverage(msgsPerDay.slice(0, 7))) / (actualDataLength * 24)) /* for some reason */ / 24;

			// predict
			let hours = 0;
			let serverHalted = false;
			let predictedMsgsPerHour = averageMsgsPerDay / 24;
			let messagesSent = messageCountsTotal;
			if (milestone.next) {
				while (messagesSent < milestone.next && predictedMsgsPerHour > 0) {
					messagesSent += predictedMsgsPerHour;
					predictedMsgsPerHour += accelPerHour;
					hours++;
					if (hours % 24 === 0) accelPerHour *= 0.93; // reduce accel every day
				}
				if (messagesSent < milestone.next) serverHalted = true;
			}
			// turn minutes into milliseconds
			const millisecondsToMilestone = hours * 60 * 60 * 1000;

			const embed = new client.embed()
				.setTitle('Level Roles: Stats')
				.setDescription(`A total of ${messageCountsTotal.toLocaleString('en-US')} messages have been recorded in this server by ${userCount.toLocaleString('en-US')} users.\n\nIn the last ${actualDataLength} days, on average, ${averageMsgsPerDay.toLocaleString('en-US', { maximumFractionDigits: 2 })} messages have been sent every day.\n\nAn average user has sent ${average.toFixed(2)} messages.\n\n${((messageCounts.filter(x => x >= average).length / userCount) * 100).toFixed(2)}% of users have sent more than or as many messages as an average user.\n\nThe median user has sent ${median} messages.\n\nThe top 1% of users have sent ${((messageCounts.sort((a, b) => b - a).slice(0, Math.round(userCount / 100)).reduce((a, b) => a + b, 0) / messageCountsTotal) * 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}% of messages while Level Roles has existed.\n\nThe next interaction milestone ${milestone.next ? `is ${milestone.next.toLocaleString('en-US')} messages and the progress from the previous milestone (${milestone.previous.toLocaleString('en-US')}) to the next is ${(milestone.progress * 100).toFixed(2)}%.\n\nAt the current rate, reaching the next milestone would ${(!serverHalted ? 'take ' : `never happen. The server would grind to a halt in `) + client.formatTime(millisecondsToMilestone, 2, { commas: true, longNames: true })}.` : `doesn\'t exist.`}`)
				.setColor(client.config.embedColor)
			interaction.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
			return;
		} else if(subCmd === "view"){

		const embed0 = new client.embed()
	    	.setColor(client.config.embedColor)

		// fetch user or user interaction sender
		const member = interaction.options.getMember("member") ?? interaction.member;

		// if no user could be specified, error
		if (!member) return interaction.reply({content: 'You failed to mention a user from this server.', allowedMentions: { repliedUser: false }});

		// information about users progress on level roles
		const eligiblity = await client.userLevels.getEligible(member);

		// index of next role
		let nextRoleKey;
		Object.values(client.config.mainServer.roles.levels).map(x=>x.id).forEach(async (role)=>{
			if(member.roles.cache.has(role)){
				nextRoleKey = parseInt(`${interaction.guild.roles.cache.get(role).name}`.toLowerCase().replace("level ", ""));
			}
		})

		// eligibility information about the next level role
		const nextRoleReq = eligiblity.roles[nextRoleKey ? nextRoleKey : 0];
		const lastRoleReq = nextRoleKey ? eligiblity.roles[nextRoleKey - 1] : null;

		// next <Role> in level roles that user is going to get 
		const nextRole = nextRoleReq ? nextRoleReq.role.id : undefined;
		const lastRole = lastRoleReq ? lastRoleReq.role.id : undefined;

		// level roles that user has, formatted to "1, 2 and 3"
		// let achievedRoles = Object.values(client.config.mainServer.roles.levels).filter(x=>nextRoleKey>=x.number).map(x => `<@&${x.id}>`);
		// achievedRoles = achievedRoles.map((x, i) => {
		// 	if (i === achievedRoles.length - 2) return x + ' and ';
		// 	else if (achievedRoles.length === 1 || i === achievedRoles.length - 1) return x;
		// 	else return x + ', ';
		// }).join('');
		const achievedRoles = eligiblity.roles.find(x=>x.role.has) ? `<@&${eligiblity.roles.find(x=>x.role.has).role.id}>` : "";
		
		function progressText(showRequirements = true) { // shows progress, usually to next milestone
			let text = '';
			if (showRequirements) {
				if (eligiblity.messages >= nextRoleReq.requirements.messages) text += ':white_check_mark: ';
				else text += ':x: ';
			} else text += ':gem: ';
			text += '**' + eligiblity.messages.toLocaleString('en-US') + (showRequirements ? '/' + nextRoleReq.requirements.messages.toLocaleString('en-US') : '') + ' messages\n';
			if (showRequirements) {
				if (eligiblity.age >= nextRoleReq.requirements.age) text += ':white_check_mark: ';
				else text += ':x: ';
			} else text += ':gem: ';
			text += Math.floor(eligiblity.age).toLocaleString('en-US') + 'd' + (showRequirements ? '/' + nextRoleReq.requirements.age.toLocaleString('en-US') + 'd' : '') + ' time on server**';
			return text;
		}
		
		const pronounBool = (you, they) => { // takes 2 words and chooses which to use based on if user did this command on themself
			if (interaction.user.id === member.user.id) return you || true;
			else return they || false;
		};
		
		const messageContents = [];

		if (nextRoleReq) { // if user hasnt yet gotten all the level roles
			messageContents.push(...[ 
				pronounBool('You', 'They') + (achievedRoles.length > 0 ? ' currently have the ' + achievedRoles + ' role.' : ' don\'t have any level roles yet.'), // show levels roles that user already has, if any
				pronounBool('Your', 'Their') + ` next level role is <@&${nextRole}> and here\'s ` + pronounBool('your', 'their') + ' progress:',
				progressText() // show them what their next role is
			]);
			if (nextRoleReq.eligible) { // if theyre eligible for their next role
				if (pronounBool()) { // if theyre doing this command themselves,
					setTimeout(() => { // add role
						member.roles.add(nextRole).then(() => interaction.followUp({ephemeral: true, content: `You\'ve received the <@&${nextRole}> role.`,allowedMentions: {roles: false}})).catch(() => interaction.channel.send('Something went wrong while giving you the **' + nextRole.name + '** role.'));
						lastRole ? member.roles.remove(lastRole) : null;
						// and inform user of outcome
					}, 500);
				}
			}
		} else { // they have no next roles. they have all
			messageContents.push(...[
				pronounBool('You', 'They') + ' already have all of the level roles. Here\'s ' + pronounBool('your', 'their') + ' progress:',
				progressText(false) // inform them and show progress with no next milestone
			]);
		}

		if (pronounBool()) {
			const index = Object.entries(client.userLevels._content).sort((a, b) => b[1] - a[1]).map(x => x[0]).indexOf(interaction.user.id) + 1;
			const suffix = ((index) => {
				const numbers = index.toString().split('').reverse(); // eg. 1850 -> [0, 5, 8, 1]
				if (numbers[1] === '1') { // this is some -teen
					return 'th';
				} else {
					if (numbers[0] === '1') return 'st';
					else if (numbers[0] === '2') return 'nd';
					else if (numbers[0] === '3') return 'rd';
					else return 'th';
				}
			})(index);
			
			embed0.setFooter({text: `You're ${index ? index + suffix : 'last'} in a descending list of all users, ordered by their Level Roles interaction count.`});
		}
	
		embed0.setDescription(messageContents.join('\n\n'))
		interaction.reply({embeds: [embed0], allowedMentions: { repliedUser: false }}); // compile interaction and send
	 }
	},
	data: new SlashCommandBuilder().setName("rank").setDescription("View your, another user, or stats about ranking").addSubcommand((optt)=>optt.setName("view").setDescription("View your or another user's ranking information").addUserOption((opt)=>opt.setName("member").setDescription("Views a members ranking statistics.").setRequired(false))).addSubcommand((optt)=>optt.setName("stats").setDescription("Views ranking statistics.")).addSubcommand((optt)=>optt.setName("perks").setDescription("Views ranking perks.")).addSubcommand((optt)=>optt.setName("nerd_stats").setDescription("Views more formal statistics."))
};
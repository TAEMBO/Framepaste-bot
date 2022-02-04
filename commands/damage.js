module.exports = {
	run: (client, message, args) => {
		message.delete();
		message.channel.send("https://c.tenor.com/mm6gNAyiobUAAAAC/emotional-damage.gif");
	},
	name: 'EMOTIONALDAMAGE',
	alias: ['emotionaldamage', 'damage'],
	description: `Made by ItzDihan7674 (for real)`,
	hidden: true
};
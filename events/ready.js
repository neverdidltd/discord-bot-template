const { ActivityType, Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const currentDate = new Date();
		const datetime = currentDate.getFullYear() + '-'
            + (currentDate.getMonth() + 1) + '-'
            + currentDate.getDate() + ' @ '
            + (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours() + ':'
            + (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes() + ':'
            + (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

		client.user.setPresence({
			activities: [{ name: '/help', type: ActivityType.Watching }],
			status: 'active',
		});
		console.log(`(${datetime}) Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);

		if (client.config.dev === true) {
			console.log(`(${datetime}) Bot is in dev mode`);
		}
		else {
			console.log(`(${datetime}) Bot is in live mode`);
		}

		console.log(`(${datetime}) Bot finished loading`);
	},
};
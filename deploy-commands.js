const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

const args = process.argv.slice(2);

let global = false;
let remove = false;

if (args.length === 0) {
	console.info('No arguments were passed. Assuming local (guild specified in config.json) and delete and replace commands (rather than just delete)');
}
else {
	args.forEach(arg => {
		if (arg.toLowerCase() === '--global' || arg === '-g') {
			global = true;
		}
		else if (arg.toLowerCase() === '--delete' || arg === '-d') {
			remove = true;
		}
		else if (arg.toLowerCase() === '--help' || arg === '-h') {
			console.info('Options are -g or --global to deploy the commands globally (on all guilds your bot is in rather than just the guild specified in config.json) & -d --delete which will delete all commands and not deploy new ones. More than one argument can be specified.');
			process.exit();
		}
		else {
			console.error(`bad option: ${arg}`);
			console.info('Options are -g or --global to deploy the commands globally (on all guilds your bot is in rather than just the guild specified in config.json) & -d --delete which will delete all commands and not deploy new ones. More than one argument can be specified.');
			process.exit(9);
		}
	});
}

if (global === true && remove === true) {
	let confirm = false;

	readline.question('The given arguments will delete your bots commands on all guilds only. Are you sure you want to proceed? [Y]es/[N]o ', resp => {
		if (resp.toLowerCase() === 'y' || resp.toLowerCase() === 'yes') {
			confirm = true;
		}

		if (confirm === false) {
			console.log('You didn\'t type Y or Yes therefore no action has been taken');
			process.exit();
		}
		readline.close();
	});
}

const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application command(s).`);

		// The put method is used to fully refresh all commands in the guild with the current set
		if (global !== true) {
			// First delete all commands
			rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] })
				.then(() => console.log('Successfully deleted all guild commands.'))
				.catch(console.error);

			if (remove !== true) {
				// Then register the current set
				rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
					.then((data) => console.log(`Successfully reloaded ${data.length} guild application command(s).`))
					.catch(console.error);
			}
		}
		else {
			// First delete all commands
			rest.put(Routes.applicationCommands(config.clientId), { body: [] })
				.then(() => console.log('Successfully deleted all global commands.'))
				.catch(console.error);

			if (remove !== true) {
				// Then register the current set
				rest.put(Routes.applicationCommands(config.clientId), { body: commands })
					.then((data) => console.log(`Successfully reloaded ${data.length} global application command(s).`))
					.catch(console.error);
			}
		}
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
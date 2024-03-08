const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

let sentryEnv = 'Default';

if (config.sentryEnv) {
	sentryEnv = config.sentryEnv;
}

if (config.sentryDns) {
	Sentry.init({
		dsn: config.sentryDns,
		environment: sentryEnv,
		integrations: [
			new ProfilingIntegration(),
		],
		// Performance Monitoring
		//  Capture 100% of the transactions
		tracesSampleRate: 1.0,
		// Set sampling rate for profiling - this is relative to tracesSampleRate
		profilesSampleRate: 1.0,
	});
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Attaching the config to the client, so it's available wherever client is.
client.config = config;

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(config.token);
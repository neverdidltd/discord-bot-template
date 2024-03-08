# Discord bot template using Discord.js

---

## Intro

This is a template for Discord bots Using [Discord.js](https://discord.js.org) (documentation can be found [here](https://discord.js.org/docs/packages/discord.js/14.14.1)). [Discord.js Guide](https://discordjs.guide/#before-you-begin) is another great resource and what I followed to create this template.

This template includes;
- Separated slash command files
- Command sub-folders for better organisation
- Separated event files
- Command deployment script that takes arguments
- An ESLint ruleset
- nodemon for rapid development, nodemon is a node wrapper that watches for changes and stops then restarts node when changes are detected.

## How to use this repo

### For local development

- Clone this repository `git clone git@github.com:neverdidltd/discord-bot-template.git <folder-name>`
- `cd <folder-name>` then `npm ci` to install dependencies
- Launch the project in your IDE
- Rename config.json.example to config.json and enter the information. (More information about config.json can be found [here](#configjson))
- `nodemon .` (the same as `nodemon ./index.js`)
- Develop your bot

### For deployment on production server

- Copy the files to your server or use a VCS (like Git, recommended)
- `cd <folder-name>` then ``npm ci --omit=dev`` to install dependencies but exclude development entries (like nodemon)
- Rename config.json.example to config.json and enter the information. (More information about config.json can be found [here](#configjson))
- `node .` (the same as `node ./index.js`)
- Once you have confirmed everything is worked it is recommended to set the bot up as a service so an active connection to the server isn't needed

<details>
<summary>Config Options</summary>

# config.json

### clientId
The bots' Client ID from the Discord Developer Dashboard.

### token
The bots' Client Secret from the Discord Developer Dashboard.

### guildId
The ID of your test discord server (used for local commands)

### dev
Doesn't do anything by default, included to allow for `console.log()` to be wrapped in `if (client.config.dev)` statements

### sentryDns
Used to enable [Sentry](https://sentry.io) (Leave empty to disable Sentry)

### sentryEnv
Used to specify a Sentry environment (Optional, defaults to "Default" if not supplied)
</details>
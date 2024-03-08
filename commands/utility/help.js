const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help using the bot'),
    async execute(interaction) {
        await interaction.reply({ content: "The bot has the following commands /help", ephemeral: true });
    },
};
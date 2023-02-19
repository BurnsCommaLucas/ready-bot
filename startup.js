const { Client } = require("discord.js");
const CON = require("./constants.js");
const DEPLOY = require("./deploy-commands.js")
require("dotenv").config();

const BOT = require("./bot.js");

const CLIENT = new Client({
	intents: 2048
});

const checks = {};

CLIENT.on("ready", () => {
	// Give some diagnostic info when we log in
	console.log(`Logged in as ${CLIENT.user.tag}!`);

	DEPLOY.deployCommands();

	CLIENT.user.setActivity(`/${CON.CHECK.CREATE}`);
});

CLIENT.on("interactionCreate", interaction => {
	if (!interaction.isCommand()) return;
	BOT.handleMessage(checks, interaction);
});

// Hook up to discord
CLIENT.login(process.env.BOT_TOKEN);
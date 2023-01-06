const { Client } = require("discord.js");
const DBL = require("dblapi.js");
const CON = require("./constants.js");
const DEPLOY = require("./deploy-commands.js")
require("dotenv").config();

const BOT = require("./bot.js");

const CLIENT = new Client({
	intents: 2048
});
const DBL_TOKEN = process.env.DBL_TOKEN;
const DBL_API = new DBL(DBL_TOKEN);

const checks = {};

CLIENT.on("ready", () => {
	// Give some diagnostic info when we log in
	console.log(`Logged in as ${CLIENT.user.tag}!`);

	DEPLOY.deployCommands();

	CLIENT.user.setActivity(`/${CON.CHECK.CREATE}`);

	// Every hour, update top.gg bot server count and log server count
	setInterval(() => {
		if (!DBL_TOKEN) return;
		const serverCount = CLIENT.guilds.cache.size;
		DBL_API.postStats(serverCount);
	}, 60000);
});

CLIENT.on("interactionCreate", interaction => {
	if (!interaction.isCommand()) return;
	BOT.handleMessage(checks, interaction);
});

// Hook up to discord
CLIENT.login(process.env.BOT_TOKEN);
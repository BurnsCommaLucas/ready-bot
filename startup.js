const DISCORD = require("discord.js");
const DBL = require("dblapi.js");
require("dotenv").config();

const BOT = require("./bot.js");
const CON = require("./constants.js");

const CLIENT = new DISCORD.Client();
const DBL_API = new DBL(process.env.DBL_TOKEN);

const checks = {};

CLIENT.on("message", (m) => {
	// Check if we should even be looking at the bot
	if (!m.content.startsWith(CON.PREFIX) || m.author.bot) {
		return;
	}

	BOT.handleMessage(checks, m);
});

CLIENT.on("ready", () => {
	// Give some diagnostic info when we log in
	console.log(`Logged in as ${CLIENT.user.tag}!`);

	CLIENT.user.setActivity("Slash commands incoming!\n\n!ready help");
	
	// Every hour, update top.gg bot server count and log server count
	setInterval(() => {
		const serverCount = CLIENT.guilds.cache.size;
		console.log(`Server count = ${serverCount}`);
		DBL_API.postStats(serverCount);
	}, 60000);
});

// Hook up to discord
CLIENT.login(process.env.BOT_TOKEN);
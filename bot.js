const DISCORD = require("discord.js");
const DBL = require("dblapi.js");
require('dotenv').config()

const CLIENT = new DISCORD.Client();
const DBL_API = new DBL(process.env.DBL_TOKEN)

const util = require('./utilities.js');
const con = require('./constants.js');

var check = false;
var ready = [];
var checker = "";

CLIENT.on("message", (m) => {
	const cont = m.content;
	const chan = m.channel;
	const auth = m.author;
	if (!cont.startsWith(con.PREFIX)) {
		return;
	}
	const args = cont.slice(con.PREFIX.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	switch (command) {
		case (con.CHECK_READY_CMD):
			if (args[0] == con.CHECK_NUM_CMD) {
				if (check) {
					var numLeft = (check - ready.length);
					chan.send("Still waiting for " + numLeft + " player" + util.plural(numLeft) + " to ready.");
				}
				else {
					util.errorMsg(chan, "No ready check active.");
				}
			}
			else if (isNaN(args[0]) || args[0] <= 0) {
				if (typeof args[0] == 'undefined') {
					util.errorMsg(chan, "How many players do you want to wait for?");
				}
				else {
					util.errorMsg(chan, "What? You can't have \"" + args[0] + "\" player" + util.plural(args[0]) + " to check.");
				}
			}
			else {
				check = args[0];
				ready = [];
				checker = auth;
				chan.send(con.EVERY + " ready up! Type `" + con.PREFIX + con.READY_CMD + "`. Waiting for " + check + " player" + util.plural(check) + ".");
			}
		break;
		case (con.READY_CMD):
			if (args[0] == con.HELP_CMD) {
				util.helpMsg(chan);
			}
			else {
				if (check) {
					if (ready.indexOf(auth) == -1) {
						ready.push(auth);
						var numLeft = (check - ready.length);
						chan.send(auth + " is ready! " + numLeft + " player" + util.plural(numLeft) + " left.");
						if (check == ready.length) {
							check = false;
							ready = [];
							chan.send("Ready check complete, " + checker + ". Lets go!");
						}
					}
					else {
						chan.send("You've already readied!");
					}
				}
				else {
					util.errorMsg(chan, "No ready check active.");
				}
			}
		break;
		case (con.UNREADY_CMD):
			if (check) {
				var index = ready.indexOf(auth);
				if (index == -1) {
					chan.send("You haven't readied yet, no need to unready!");
				}
				else {
					ready.splice(index, 1);
					var numLeft = (check - ready.length);
					chan.send(auth + " is not ready! " + numLeft + " player" + util.plural(numLeft) + " left.");
				}
			}
			else {
				util.errorMsg(chan, "No ready check active.");
			}
		break;
		default:
		break;
	}
});

// Give some diagnostic info when we log in
CLIENT.on('ready', () => {
	console.log(`Logged in as ${CLIENT.user.tag}!`);
});

// Hook up to discord
CLIENT.login(process.env.BOT_TOKEN);

// Every hour, update top.gg bot server count and log server count
CLIENT.on('ready', () => {
    setInterval(() => {
		console.log("Server count = " + CLIENT.guilds.size);
        DBL_API.postStats(CLIENT.guilds.size);
    }, 60000);
});
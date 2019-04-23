const DISCORD = require("discord.js");
const CLIENT = new DISCORD.Client();

const util = require('./utilities.js');
const con = require('./constants.js');

var check = false;
var ready = [];
var checker = "";

CLIENT.on("message", (m) => {
        console.log("Bot currently on " + CLIENT.guilds.size + " servers");
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
				chan.send("@everyone ready up! Type `" + con.PREFIX + con.READY_CMD + "`. Waiting for " + check + " player" + util.plural(check) + ".");
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

CLIENT.login(process.env.BOT_TOKEN);

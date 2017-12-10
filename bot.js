const DISCORD = require("discord.js");
const CLIENT = new DISCORD.Client();
const PREFIX = "!";
const CHECK_READY_CMD = "cready";
const CHECK_NUM_CMD = "?";
const READY_CMD = "ready";
const USAGE = PREFIX + CHECK_READY_CMD;

var check = false;
var ready = [];
var checker = "";

CLIENT.on("message", (m) => {
	var cont = m.content;
	var chan = m.channel;
	var auth = m.author;
	if (cont.startsWith(PREFIX)) {
		const args = cont.slice(PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if (command == CHECK_READY_CMD) {
			if (args[0] == CHECK_NUM_CMD) {
				if (check) {
					var numLeft = (check - ready.length);
					chan.send("Still waiting for " + numLeft + " player" + (numLeft != 1 ? "s" : "") + " to ready.");
				}
				else {
					noRCAck(chan, "No ready check active.");
				}
			}
			else if (isNaN(args[0]) || args[0] <= 0) {
				if (typeof args[0] == 'undefined') {
					noRCAck(chan, "How many players do you want to wait for?");
				}
				else {
					noRCAck(chan, "What? You can't have \"" + args[0] + "\" player" + (args[0] != "one" ? "s" : "") + " to check.");
				}
			}
			else {
				check = args[0];
				ready = [];
				checker = auth;
				chan.send("@everyone ready up! Type `" + PREFIX + READY_CMD + "`. Waiting for " + check + " player" + (check != 1 ? "s" : "") + ".");
			}
		}
		if (command == READY_CMD) {
			if (check) {
				if (ready.indexOf(auth) == -1) {
					ready.push(auth);
					var numLeft = (check - ready.length);
					chan.send(auth + " is ready! " + numLeft + " player" + (numLeft != 1 ? "s" : "") + " left.");
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
				noRCAck(chan, "No ready check active.");
			}
		}
		if (command == "help") {
			chan
		}
	}
});

function noRCAck (chan, reason) {
	chan.send((typeof reason == 'undefined' ? "" : reason + " ") + "Type ```" + USAGE + 
	" <number>``` to start a ready check, and ```" + USAGE + " " + CHECK_NUM_CMD + 
	"``` to check how many players still need to ready.");
}

CLIENT.login(process.env.BOT_TOKEN);
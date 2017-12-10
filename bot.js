const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "!";
const CHECK_READY_CMD = "cready";
const CHECK_NUM_CMD = "?";
const READY_CMD = "ready";
var check;
var ready = [];
var checker = "";

client.on("ready", () => {
	console.log("I am ready");
});

client.on("message", (m) => {
	if (m.content.startsWith(prefix)) {
		const args = m.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if (command == CHECK_READY_CMD) {
			if (args[0] == CHECK_NUM_CMD) {
				if (check) {
					m.channel.send("Still waiting for " + (check - ready.length) + " players to ready.");
				}
			}
			else if (isNaN(args[0])) {
				if (typeof args[0] == 'undefined') {
					m.channel.send("How many players do you want to wait for? Type " + prefix + CHECK_READY_CMD + " <number> to wait for your desired number of players to ready!");
				}
				else {
					m.channel.send("What? You can't have \"" + args[0] + "\" players to check...");
				}
			}
			else {
				check = args[0];
				checker = m.author;
				m.channel.send("Ready up! Waiting for " + check + " players.");
			}
		}
		if (command == READY_CMD) {
			if (check) {
				if (ready.indexOf(m.author) == -1) {
					ready.push(m.author);
					m.channel.send(m.author + " is ready! " + (check - ready.length) + " players left.");
					if (check == ready.length) {
						check = false;
						ready = [];
						m.channel.send("Ready check complete, " + checker + ". Lets go!");
					}
				}
				else {
					m.channel.send("You've already readied!");
				}
			}
			else {
				m.channel.send("No ready check active. Type " + prefix + CHECK_READY_CMD + " to start a ready check");
			}
		}
	}
});

client.login("Mzg5MjEwNjQwNjEyNTg5NTY4.DQ4TPw.vlSsoyWy9NN_m4i9Y_HRLp2OBxw");
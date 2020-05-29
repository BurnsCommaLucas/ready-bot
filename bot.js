const DISCORD = require('discord.js');

const Check = require('./Check.js');
const CON = require('./constants.js');
const UTIL = require('./utilities.js');

module.exports = {
	/**
	 * Handles check creation/management flow
	 * @param {string} content
	 * @param {DISCORD.Channel} channel
	 * @param {DISCORD.User} user
	 */
	handleMessage(checks, content, channel, user) {
		var fn;

		// Get the current check for the current channel if one exists
		const currentCheck = checks[channel.id];

		// Break down the message
		const args = content.slice(CON.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		switch (command) {
			case (CON.CHECK_READY_CMD):
				this.createCheckHandler.call(checks, channel, user, args);
				break;
			case (CON.READY_CMD):
				fn = Check.prototype.readyUser;
			case (CON.UNREADY_CMD):
				if (args[0] == CON.HELP_CMD) {
					UTIL.helpMsg(channel);
					return;
				}
				if (!currentCheck) {
					UTIL.errorMsg(channel, "No ready check active in this channel.");
					break;
				}

				// Get the right ready/unready function and call it
				fn = (fn || Check.prototype.unReadyUser);
				fn.call(currentCheck, user);

				if (Check.prototype.isCheckSatisfied.call(currentCheck)) {
					delete checks[channel.id];
					channel.send(`Ready check complete, ${Check.prototype.getAuthor.call(currentCheck)} lets go!`);
				}
				break;
			default:
				break;
		}
	},

	/**
	 * Helper function to create a check associated with the given channel & author
	 * @param {DISCORD.Channel} channel 
	 * @param {DISCORD.User} author 
	 * @param {any[]} args 
	 */
	createCheckHandler: function (channel, author, args) {
		if (args[0] == CON.CHECK_NUM_CMD) {
			var currentCheck;
			if (currentCheck = this[channel.id]) {
				const numLeft = Check.prototype.countRemaining.call(currentCheck);
				channel.send(`Still waiting for ${numLeft} player${UTIL.plural(numLeft)} to ready.`);
			}
			else {
				UTIL.errorMsg(channel, "No ready check active in this channel.");
			}
		}
		else if (isNaN(args[0]) || args[0] <= 0) {
			// No players/count supplied
			if (typeof args[0] === undefined) {
				UTIL.errorMsg(channel, "How many players do you want to wait for?");
			}
			// Invalid player/count supplied
			else {
				UTIL.errorMsg(channel, `What? You can't have "${args[0] || ''}" player${UTIL.plural(args[0])} to check.`);
			}
		}
		else {
			this[channel.id] = new Check(channel, author, args[0]);
		}
	}
}
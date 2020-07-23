const DISCORD = require('discord.js');

const Check = require('./Check.js');
const CON = require('./constants.js');
const UTIL = require('./utilities.js');

module.exports = {
	/**
	 * Handles check creation/management flow
	 * @param {Map<String, Check>} checks
	 * @param {DISCORD.Message} m
	 */
	handleMessage(checks, m) {
		var fn;
		const channel = m.channel;
		const author = m.author;

		// Get the current check for the current channel if one exists
		const currentCheck = checks[channel.id];

		// Break down the message
		const args = m.content.slice(CON.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const firstArg = args[0];

		switch (command) {
			case (CON.CHECK_READY_CMD):
				if (firstArg == CON.CHECK_NUM_CMD) {
					if (currentCheck) {
						// const numLeft = Check.prototype.countRemaining.call(currentCheck);
						channel.send(`Still waiting for ${Check.prototype.getRemainderString.call(currentCheck)} to ready.`);
					}
					else {
						UTIL.errorMsg(channel, "No ready check active in this channel.");
					}
					break;
				}
				this.createCheckHandler.call(this, checks, channel, author, m, firstArg);
				break;
			case (CON.READY_CMD):
				if (firstArg == CON.HELP_CMD) {
					UTIL.helpMsg(channel);
					break;
				}
				else if (firstArg == CON.CONTRIBUTE) {
					channel.send("To contribute to ready-bot go to https://github.com/BurnsCommaLucas/ready-bot")
					break;
				}
				fn = Check.prototype.readyUser;
			case (CON.UNREADY_CMD):
				if (!currentCheck) {
					UTIL.errorMsg(channel, "No ready check active in this channel.");
					break;
				}

				// Get the right ready/unready function and call it
				fn = (fn || Check.prototype.unReadyUser);
				fn.call(currentCheck, author);

				if (Check.prototype.isCheckSatisfied.call(currentCheck)) {
					delete checks[channel.id];
					channel.send(`Ready check complete, ${Check.prototype.getAuthor.call(currentCheck)}. Lets go!`);
				}
				break;
			default:
				break;
		}
	},

	/**
	 * Helper function to create a check associated with the given channel & author
	 * @param {Map<String, Check>} checks
	 * @param {DISCORD.TextChannel} channel 
	 * @param {DISCORD.User} author 
	 * @param {DISCORD.Message} m
	 * @param {any} firstArg
	 */
	createCheckHandler: function (checks, channel, author, m, firstArg) {
		var targetUsers = [];
		var targetCount;

		if (m.mentions.users.size > 0 || m.mentions.everyone) {
			if (!(targetUsers = this.getTargetUsers.call(this, m))) {
				return;
			}
		}

		targetCount = targetCount || parseInt(firstArg);
		var activeParam;
		var targetName = "";

		const newCheck = new Check(channel, author);

		if (targetUsers.length > 0) {
			if (firstArg == CON.HERE || firstArg == CON.EVERY) {
				targetName = firstArg;
			}
			activeParam = targetUsers;
		}
		// I use firstArg here instead of targetCount to preserve what the user typed so I can be sassy
		else if (isNaN(firstArg) || firstArg <= 0) {
			// No players/count supplied
			if (firstArg === undefined) {
				UTIL.errorMsg(channel, "How many players do you want to wait for?");
				return;
			}
			// Invalid player/count supplied
			else {
				UTIL.errorMsg(channel, `What? You can't have "${firstArg || ''}" player${UTIL.plural(firstArg)} to check.`);
				return;
			}
		}
		else {
			activeParam = targetCount;
		}

		if (Check.prototype.activate.call(newCheck, activeParam, targetName)) {
			checks[channel.id] = newCheck;
		}
		else {
			UTIL.errorMsg(channel, `Sorry ${author}, something went wrong and I couldn't create your check.\n` +
				`Please type \`${CON.PREFIX}${CON.CHECK_READY_CMD} ${CON.CONTRIBUTE}\` to report this to my maker!\n`)
			console.error("Failed to create check:");
			console.error(m);
		}
	},

	/**
	 * Parse mentions of a message to create a list of users to check. Supports `@here` and `@everyone` tags
	 * @param {DISCORD.Message} m 
	 * @returns {DISCORD.User[]}
	 */
	getTargetUsers: function (m) {
		var mentionList, targetUsers;

		// Figure out who "everyone" is (covers @everyone and @here), convert to list
		if (m.mentions.everyone) {
			mentionList = m.channel.members.map(gm => gm.user);
		}
		// Grab the list of user mentions if available, convert to list
		else {
			mentionList = m.mentions.users.map(u => u);
		}

		// Filter out bots and let the user know if we hit 0 users
		targetUsers = mentionList.filter(u => !u.bot);

		const filteredUsers = UTIL.leftOuter(mentionList, targetUsers);

		if (filteredUsers.length > 0) {
			// channel.send(`Can't ready check bots, I'll leave out these users ${filteredUsers.join(", ")}`);
			if (targetUsers.length == 0) {
				m.channel.send("No users to check, try again with people instead of bots.")
				return;
			}
		}
		return targetUsers;
	}
}
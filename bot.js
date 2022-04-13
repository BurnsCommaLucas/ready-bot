const DISCORD = require('discord.js');
const Check = require('./Check.js');
const CON = require('./constants.js');
const UTIL = require('./utilities.js');

module.exports = {
	/**
	 * Handles check creation/management flow
	 * @param {Map<String, Check>} checks
	 * @param {DISCORD.CommandInteraction} interaction
	 */
	async handleMessage(checks, interaction) {
		var fn;
		const channelId = interaction.channelId;
		const author = interaction.user;

		// Get the current check for the current channel if one exists
		const currentCheck = checks[channelId];

		switch (interaction.commandName) {
			case (CON.HELP):
				await interaction.reply({
					content: `To create a check, run \`/${CON.CHECK.CREATE}\`\n` +
						`To respond to a check, run \`/${CON.READY}\` or \`/${CON.UNREADY}\`\n` +
						`To see who still needs to ready, run \`/${CON.STATUS}\``,
					ephemeral: true
				});
				break;
			case (CON.CONTRIBUTE):
				await interaction.reply({
					content: "To get involved in the development of ready-bot or to report an issue, visit our [Github](https://github.com/BurnsCommaLucas/ready-bot)",
					ephemeral: true
				});
				break;
			case (CON.READY):
				fn = Check.prototype.readyUser;
			case (CON.UNREADY):
				if (!currentCheck) {
					await interaction.reply({
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
					break;
				}

				// Get the right ready/unready function and call it
				fn = (fn || Check.prototype.unReadyUser);
				fn.call(currentCheck, author);

				if (Check.prototype.isCheckSatisfied.call(currentCheck)) {
					delete checks[channel.id];
					return await interaction.reply({
						content: `Ready check complete, ${Check.prototype.getAuthor.call(currentCheck)}. Let's go!`
					});
				}
				break;
			case (CON.STATUS):
				if (currentCheck) {
					await interaction.reply({
						content: `Still waiting for ${Check.prototype.getRemainderString.call(currentCheck)} to ready.`,
						ephemeral: true
					});
				}
				else {
					await interaction.reply({
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
				}
				break;
			case (CON.CHECK.CREATE):
				this.createCheckHandler.call(this, checks, interaction);
				break;
			default:
				await interaction.reply({
					content: "uhhhh whoops"
				});
				break;
		}

		setTimeout(async () => {
			if (!interaction.replied) {
				await interaction.reply({
					content: "Sorry, something has gone wrong ¯\\_(ツ)_/¯",
					ephemeral: true
				})
			}
		}, 3000);
	},

	/**
	 * Helper function to create a check associated with the given channel & author
	 * @param {Map<String, Check>} checks
	 * @param {DISCORD.CommandInteraction} interaction
	 */
	async createCheckHandler(checks, interaction) {
		// var targetUsers = [];
		// var targetCount;

		// if (m.mentions.users.size > 0 || m.mentions.everyone) {
		// 	if (!(targetUsers = this.getTargetUsers.call(this, m))) {
		// 		return;
		// 	}
		// }

		var count;
		try {
			count = interaction.options.data.filter(opt => opt.name === CON.CHECK.CREATE_NUM_TARGET)[0].value;
		} catch (error) {
			console.debug("Failed to parse count for check.");
		}

		const mentions = interaction.options.resolved.users;// Should this be ".members"?

		// console.log(interaction.channel.members);

		var hasMentions;
		console.log(mentions);
		try {
			hasMentions = !!mentions.length;
		} catch (error) {
			console.debug("Failed to check contents of mentions object.");
		}

		console.log(count, hasMentions);

		if ((count && hasMentions) || (!count && !hasMentions)) {
			await interaction.reply({
				content: `Please use either \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_MENTION_TARGET}\` or \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_NUM_TARGET}\``,
				ephemeral: true
			});
			return;
		}

		await interaction.reply({
			content: `Creating check for ${count || mentions.toJSON().toString()}`,
			ephemeral: true
		});

		return;

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
				UTIL.errorMsg("How many players do you want to wait for?");
				return;
			}
			// Invalid player/count supplied
			else {
				UTIL.errorMsg(`What? You can't have "${firstArg || ''}" player${UTIL.plural(firstArg)} to check.`);
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
			UTIL.errorMsg(`Sorry ${author}, something went wrong and I couldn't create your check.\n` +
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
			if (targetUsers.length == 0) {
				return "No users to check, try again with people instead of bots."
			}
		}
		return targetUsers;
	}
}
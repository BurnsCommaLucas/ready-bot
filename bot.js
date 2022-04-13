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
		const author = interaction.user;

		// Get the current check for the current channel if one exists
		const currentCheck = checks[interaction.channelId];

		switch (interaction.commandName) {
			case (CON.HELP):
				UTIL.safeReply(interaction, {
					content: `To create a check, run \`/${CON.CHECK.CREATE}\`\n` +
						`To respond to a check, run \`/${CON.READY}\` or \`/${CON.UNREADY}\`\n` +
						`To see who still needs to ready, run \`/${CON.STATUS}\``,
					ephemeral: true
				});
				return;
			case (CON.CONTRIBUTE):
				UTIL.safeReply(interaction, {
					content: "To get involved in the development of ready-bot or to report an issue, visit our [Github](https://github.com/BurnsCommaLucas/ready-bot)",
					ephemeral: true
				});
				return;
			case (CON.READY):
				fn = Check.prototype.readyUser;
			case (CON.UNREADY):
				if (!currentCheck) {
					UTIL.safeReply(interaction, {
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
					return;
				}

				// Get the right ready/unready function and call it
				fn = (fn || Check.prototype.unReadyUser);
				const response = fn.call(currentCheck, author);

				if (Check.prototype.isCheckSatisfied.call(currentCheck)) {
					delete checks[interaction.channelId];
					await currentCheck.interaction.editReply({
						content: `Ready check complete, ${Check.prototype.getAuthor.call(currentCheck).toString()}. Let's go!`
					});
				}
				return;
			case (CON.STATUS):
				if (currentCheck) {
					UTIL.safeReply(interaction, {
						content: `Still waiting for ${Check.prototype.getRemainderString.call(currentCheck)} to ready.`,
						ephemeral: true
					});
				}
				else {
					UTIL.safeReply(interaction, {
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
				}
				return;
			case (CON.CHECK.CREATE):
				try {
					this.createCheckHandler.call(this, checks, interaction);
				} catch (error) {
					console.error(error);
					UTIL.safeReply(interaction, {
						content: "Sorry, something went wrong while creating your check.",
						ephemeral: true
					});
				}
				return;
			default:
				setTimeout(async () => {
					if (!interaction.replied) {
						UTIL.safeReply(interaction, {
							content: "Sorry, something has gone wrong ¯\\_(ツ)_/¯",
							ephemeral: true
						})
					}
				}, 5000);
				break;
		}

		setTimeout(async () => {
			if (!interaction.replied) {
				UTIL.safeReply(interaction, {
					content: "Sorry, something has gone wrong ¯\\_(ツ)_/¯",
					ephemeral: true
				})
			}
		}, 5000);
	},

	/**
	 * Helper function to create a check associated with the given channel & author
	 * @param {Map<String, Check>} checks
	 * @param {DISCORD.CommandInteraction} interaction
	 */
	async createCheckHandler(checks, interaction) {
		var count;
		try {
			count = interaction.options.data.filter(opt => opt.name === CON.CHECK.CREATE_NUM_TARGET)[0].value;
		} catch (error) {
			console.debug("Failed to parse number from count param.");
		}

		const mentions = interaction.options.resolved.users;

		var hasMentions;
		try {
			hasMentions = !!mentions.size;
		} catch (error) {
			console.debug("Failed to check contents of mentions object, may be empty.");
		}

		if ((count && hasMentions) || (!count && !hasMentions)) {
			UTIL.safeReply(interaction, {
				content: `Please use either \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_MENTION_TARGET}\` or \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_NUM_TARGET}\``,
				ephemeral: true
			});
			return;
		}

		var activeParam = mentions || count;

		const newCheck = new Check(interaction);

		console.log(activeParam);
		if (Check.prototype.activate.call(newCheck, activeParam)) {
			checks[interaction.channelId] = newCheck;
		}
		else {
			UTIL.safeReply(interaction, {
				content: UTIL.errorMsg(`Sorry ${author}, something went wrong and I couldn't create your check.\nPlease type \`/${CON.CONTRIBUTE}\` for a link to report this to my maker`),
				ephemeral: true
			});
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
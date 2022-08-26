const DISCORD = require('discord.js');
const { buildConnector } = require('undici');
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
		const channelId = interaction.channelId;

		const newCheck = new Check(author);

		// Get the current check for the current channel if one exists
		const currentCheck = checks[channelId];

		switch (interaction.commandName) {
			case (CON.HELP):
				await UTIL.safeRespond(interaction, {
					content: `To create a check, run \`/${CON.CHECK.CREATE}\`\n` +
						`To respond to a check, run \`/${CON.READY}\` or \`/${CON.UNREADY}\`\n` +
						`To see who still needs to ready, run \`/${CON.STATUS}\`\n` +
						`If you still need help, you can come check out our Github page. Type \`/${CON.CONTRIBUTE}\``,
					ephemeral: true
				});
				return;
			case (CON.CONTRIBUTE):
				await UTIL.safeRespond(interaction, {
					content: "To get involved in the development of ready-bot or to report an issue, visit our [Github](https://github.com/BurnsCommaLucas/ready-bot)",
					ephemeral: true
				});
				return;
			case (CON.READY):
				fn = Check.prototype.readyUser;
			case (CON.UNREADY):
				if (!currentCheck) {
					await UTIL.safeRespond(interaction, {
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
					return;
				}

				// Get the right ready/unready function and call it
				fn = (fn || Check.prototype.unReadyUser);
				await fn.call(currentCheck, author, interaction);

				if (Check.prototype.isCheckSatisfied.call(currentCheck)) {
					delete checks[channelId];
				}
				return;
			case (CON.STATUS):
				if (currentCheck) {
					await UTIL.safeRespond(interaction, {
						content: `Still waiting for ${Check.prototype.getRemainderString.call(currentCheck)} to ready.`,
						ephemeral: true
					});
				}
				else {
					await UTIL.safeRespond(interaction, {
						content: UTIL.errorMsg("No ready check active in this channel."),
						ephemeral: true
					});
				}
				return;
			case (CON.CHECK.CREATE):
				if (interaction.options.data.length <= 0) {
					await UTIL.safeRespond(interaction, {
						content: `You'll need to select either \`${CON.CHECK.CREATE_MENTION_TARGET}\` or \`${CON.CHECK.CREATE_NUM_TARGET}\` to create a check.`,
						ephemeral: true
					});
					return;
				}

				const checkType = interaction.options.data[0].name;
				var activeParam;
				switch (checkType) {
					case CON.CHECK.CREATE_MENTION_TARGET:
						activeParam = await this.parseMentionCheckHandler.call(this, interaction)
						break;
					case CON.CHECK.CREATE_NUM_TARGET:
						activeParam = await this.parseNumCheckHandler.call(this, interaction)
						break;
					default:
						await UTIL.safeRespond(interaction, {
							content: `I don't understand check type '${checkType}'. Please get in touch with my creator to let them know this happened!`,
							ephemeral: true
						});
						return;
				}

				// If the activeParam is filled out and the activation call succeeds, save the check
				if (!!activeParam && Check.prototype.activate.call(newCheck, activeParam)) {
					const plural = UTIL.plural(newCheck.count);
					await UTIL.safeRespond(interaction, {
						content: `${UTIL.whoToReady(newCheck.targets) || "Everyone"} ready up! Type \`/${CON.READY}\`. ${author} is waiting for ${newCheck.count} user${plural}.`
					});
					checks[channelId] = newCheck;
				}
				else {
					if (interaction.replied) break;
					await UTIL.safeRespond(interaction, {
						content: `Sorry, something went wrong and I couldn't create your check.\n` +
							`Please type \`/${CON.CONTRIBUTE}\` to report this to my maker!`,
						ephemeral: true
					});
					console.error("Failed to create check:", interaction);
					console.error("target:", activeParam);
				}
				break;
			default:
				await UTIL.safeRespond(interaction, {
					content: "Yikes! Somehow a command not meant for me made it all the way to my system 😥. Please let my creator know this happened! https://github.com/BurnsCommaLucas/ready-bot",
					ephemeral: true
				});
				break;
		}

		setTimeout(async () => {
			if (!interaction.replied) {
				await UTIL.safeRespond(interaction, {
					content: "Sorry, something has gone wrong! If this message keeps showing up, please get " +
						"in touch with my maker since it probably means something bad is happening to my system. " +
						"https://github.com/BurnsCommaLucas/ready-bot",
					ephemeral: true
				})
			}
		}, 2000);
	},

	/**
	 * 
	 * @param {DISCORD.CommandInteraction} interaction
	 */
	async parseMentionCheckHandler(interaction) {
		// Don't handle @everyone or @here tags so we don't spam people
		if (interaction.options.data[0].value.indexOf("@everyone") != -1 || interaction.options.data[0].value.indexOf("@here") != -1) {
			await UTIL.safeRespond(interaction, {
				content: "Sorry, I can't use global tags like \`everyone\` or \`here\`. Try picking individual users instead.",
				ephemeral: true
			});
			return;
		}

		// This can in theory resolve roles to users, but I've found it very 
		// picky about when it will/won't pick up a user as part of a role
		const resolvedTags = interaction.options.resolved;
		let mentions = [];

		try {
			mentions.push(
				...resolvedTags
					.members
					.map(member => member.user)
					.filter(user => !user.bot)
					.values()
			);
		} catch (e) {
			// Author didn't tag any users
		}

		if (mentions === undefined || mentions.length === 0) {
			await UTIL.safeRespond(interaction, {
				content: `You'll need to select some users to create a \`${CON.CHECK.CREATE_MENTION_TARGET}\` check. Keep in mind I can't wait for bots or roles.\n` +
					`If you'd like to wait for a number of users rather than specific users, use \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_NUM_TARGET}\``,
				ephemeral: true
			});
			return;
		}

		return mentions
	},

	/**
	 * Helper function to create a check associated with the given channel & author
	 * @param {DISCORD.CommandInteraction} interaction
	 */
	async parseNumCheckHandler(interaction) {
		var count;
		try {
			count = interaction.options.data.filter(opt => opt.name === CON.CHECK.CREATE_NUM_TARGET)[0].value;
		} catch (error) {
			console.debug("Failed to parse count for check.", error);
			return;
		}

		if (count < 1) {
			await UTIL.safeRespond(interaction, {
				content: `Sorry, I can only wait for one or more users with a \`${CON.CHECK.CREATE_NUM_TARGET}\` check. Try creating your check with a count of at least 1.\n` +
					`If you'd like to wait for specifc users rather than a number, use \`/${CON.CHECK.CREATE} ${CON.CHECK.CREATE_MENTION_TARGET}\``,
				ephemeral: true
			});
			return;
		}

		return count;
	}
}
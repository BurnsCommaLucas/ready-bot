const DISCORD = require("discord.js");

const CON = require("./constants.js");
const UTIL = require("./utilities.js");

class Check {
	/**
	 * @param {DISCORD.CommandInteraction} _interaction The interaction which initiated this check 
	 */
	constructor(_interaction) {
		this.interaction = _interaction;
		this.count = 0;
		this.targets = [];
		this.readiedUsers = [];
		this.readiedCount = 0;
	}

	/**
	 * @param {number| Array<DISCORD.User>} _target how many people/which people to have ready
	 */
	async activate(_target) {
		if (!isNaN(_target)) {
			this.count = _target;
			this.isTargeted = false;
		}
		else if (_target instanceof Array) {
			this.targets = _target;
			this.count = this.targets.length;
			this.isTargeted = true;
		}
		else {
			console.error("Falied to determine check type.")
			console.error(_target);
			return false;
		}
		const plural = UTIL.plural(this.count);
		await UTIL.safeReply(this.interaction, {
			content: `${UTIL.buildMentionString(this.targets)} ready up! Type \`/${CON.READY}\`. \n${this.interaction.user.toString()} is waiting for ${this.count} player${plural}.`
		});
		return true;
	}

	/**
	 * @returns {number} The amount of users who still need to ready-up
	 */
	countRemaining() {
		return this.count - this.readiedCount;
	}

	/**
	 * @returns {DISCORD.User} The user who created this ready check
	 */
	getAuthor() {
		return this.interaction.user;
	}

	/**
	 * @returns {string} A description of who/how many players still need to mark themselves ready
	 */
	getRemainderString() {
		return this.isTargeted ? UTIL.buildMentionString(UTIL.leftOuter(this.targets, this.readiedUsers)) : (() => {
			const count = this.countRemaining();
			return `${count} player${UTIL.plural(count)}`;
		})();
	}

	/**
	 * @returns {boolean} True if readiness count OR target list has been fulfilled
	 */
	isCheckSatisfied() {
		var retVal = true;
		if (this.isTargeted) {
			this.targets.forEach(u => {
				if (!this.isUserReadied(u)) {
					retVal = false;
				}
			});
		}
		else {
			retVal = this.readiedCount == this.count;
		}
		return retVal
	}

	/**
	 * Test if user has readied in this check
	 * @param {DISCORD.User} user User to check
	 * @returns {boolean} True if user has already readied in this check, else false
	 */
	isUserReadied(user) {
		return this.readiedUsers.indexOf(user) > -1;
	}

	/**
	 * Test if user has been asked to ready in this check
	 * @param {DISCORD.User} user User to check
	 * @returns {boolean} True if user has been asked to ready in this check, else false
	 */
	isUserReadyRequired(user) {
		return this.targets.indexOf(user) > -1;
	}

	baseMessagePreamble() {
		if (!!this.readiedUsers.length) {
			return "Nobody is"
		}
	}

	/**
	 * Mark the user ready if appropriate
	 * @param {DISCORD.User} user User to mark ready
	 */
	readyUser(user) {
		// If this user has already readied for this check
		if (this.isUserReadied(user)) {
			return {
				content: "You've already readied!",
				ephemeral: true
			};
		}

		// If check is username based but this user doesn't need to ready for this check
		if (this.isTargeted && !this.isUserReadyRequired(user)) {
			return {
				content: "You don't need to ready in this check!",
				ephemeral: true
			};
		}

		this.readiedUsers.push(user);
		this.readiedCount = this.readiedUsers.length;
		// TODO edit base reply
		await UTIL.safeReply(this.interaction, {
			content: `${this.baseMessagePreamble()} ready! ${this.countRemaining()} player${UTIL.plural(this.countRemaining())} left.`
		});
	}

	/**
	 * Mark the user ready if appropriate
	 * @param {DISCORD.User} user User to mark ready
	 */
	unReadyUser(user) {
		return this.isUserReadied(user) ? "You haven't readied yet, no need to unready!" : (() => {
			this.readiedUsers.splice(this.readiedUsers.indexOf(user), 1);
			this.readiedCount = this.readiedUsers.length;
			UTIL.safeReply(this.interaction, {
				content: ``
			},
			true);
			msg = `${user} is not ready! ${this.countRemaining()} player${UTIL.plural(this.countRemaining())} left.`;
		}
		)();
	}
}

module.exports = Check;
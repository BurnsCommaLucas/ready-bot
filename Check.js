const DISCORD = require("discord.js");

const CON = require("./constants.js");
const UTIL = require("./utilities.js");

class Check {
	/**
	 * @param {DISCORD.Channel} channel The channel this check is associated with
	 * @param {DISCORD.User} author The user who initiated the check
	 * @param {DISCORD.User[]} targets The users who the author wants to have ready-up
	 * @param {number} count The number of users the author wants to have ready-up
	 */
	constructor(channel, author, count, targets = []) {
		this.channel = channel;
		this.author = author;
		this.targets = targets;
		this.count = count;
		this.isTargeted = targets.length > 0;
		this.readiedUsers = [];
		this.readiedCount = 0;
		channel.send(`${UTIL.whoToReady(targets)} ready up! Type \`${CON.PREFIX}${CON.READY_CMD}\`. ${author} is waiting for ${count} player${UTIL.plural(count)}.`);
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
		return this.author;
	}

	/**
	 * @returns {boolean} True if readiness count OR target list has been fulfilled
	 */
	isCheckSatisfied() {
		return this.readiedCount == this.count;
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

	/**
	 * Mark the user ready if appropriate
	 * @param {DISCORD.User} user User to mark ready
	 */
	readyUser(user) {
		// If this user has already readied for this check
		if (this.isUserReadied(user)) {
			this.channel.send("You've already readied!");
			return;
		}

		// If check is username based but this user doesn't need to ready for this check
		if (this.isTargeted && !this.isUserReadyRequired(user)) {
			this.channel.send("You don't need to ready in this check!");
			return;
		}

		this.readiedUsers.push(user);
		this.readiedCount = this.readiedUsers.length;
		this.channel.send(`${user} is ready! ${this.countRemaining()} player${UTIL.plural(this.countRemaining())} left.`);
	}

	/**
	 * Mark the user ready if appropriate
	 * @param {DISCORD.User} user User to mark ready
	 */
	unReadyUser(user) {
		var msg;
		if (!this.isUserReadied(user)) {
			msg = "You haven't readied yet, no need to unready!";
		}
		else {
			this.readiedUsers.splice(this.readiedUsers.indexOf(user), 1);
			this.readiedCount = this.readiedUsers.length;
			msg = `${user} is not ready! ${this.countRemaining()} player${UTIL.plural(this.countRemaining())} left.`;
		}
		this.channel.send(msg);
	}
}

module.exports = Check;
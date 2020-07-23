const DISCORD = require("discord.js");

const CON = require("./constants.js");
const UTIL = require("./utilities.js");

class Check {
	/**
	 * @param {DISCORD.Channel} _channel The channel this check is associated with
	 * @param {DISCORD.User} _author The user who initiated the check
	 */
	constructor(_channel, _author) {
		this.channel = _channel;
		this.author = _author;
		this.count = 0;
		this.targets = [];
		this.readiedUsers = [];
		this.readiedCount = 0;
	}

	/**
	 * @param {number|DISCORD.User} _target how many people/which people to have ready
	 * @param {string} _targetName what tag to use in chat if not the individual user names
	 */
	activate(_target, _targetName) {
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
			console.debug(_target);
			console.debug(_targetName);
			return false;
		}
		const plural = UTIL.plural(this.count);
		this.channel.send(`${_targetName || UTIL.whoToReady(this.targets)} ready up! Type \`${CON.PREFIX}${CON.READY_CMD}\`. ${this.author} is waiting for ${this.count} player${plural}.`);
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
		return this.author;
	}

	/**
	 * @returns {string} A description of who/how many players still need to mark themselves ready
	 */
	getRemainderString() {
		if (this.isTargeted) {
			return UTIL.whoToReady(UTIL.leftOuter(this.targets, this.readiedUsers));
		}
		const count = this.countRemaining();
		return `${count} player${UTIL.plural(count)}`;
	}

	/**
	 * @returns {boolean} True if readiness count OR target list has been fulfilled
	 */
	isCheckSatisfied() {
		var retVal = true;
		if (this.isTargeted) {
			this.targets.forEach( u => {
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
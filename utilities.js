const DISCORD = require("discord.js");

const CON = require('./constants.js');

module.exports = {
    /**
     * Post a default error message with the given reason if present
     * @param {DISCORD.Channel} channel 
     * @param {string} reason 
     */
    errorMsg: function (channel, reason = "") {
        channel.send(`${reason.length ? reason + " " : ""}Type \`${CON.PREFIX}${CON.READY_CMD} ${CON.HELP_CMD}\` for a list of commands.`);
    },

    /**
     * Post a default help message to the given channel
     * @param {DISCORD.Channel} channel 
     */
    helpMsg: function (channel) {
        channel.send("To start a ready check for a number of players:" +
        `\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} <number>\`\`\`` +
        "To start a ready check for specific players:" +
        `\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} <user tag> <user tag> ...\`\`\`` +
        "To ready-up:" +
        `\`\`\`${CON.PREFIX}${CON.READY_CMD}\`\`\`` +
        "To see how many people need to ready-up:" +
        `\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} ${CON.CHECK_NUM_CMD}\`\`\`` +
        "To get involved in the development of this bot or to report an issue:" +
        `\`\`\`${CON.PREFIX}${CON.READY_CMD} ${CON.CONTRIBUTE}\`\`\``);
    },

    /**
     * @param {number} val
     */
    plural: function (val) {
        return (val != 1 ? "s" : "");
    },

    /**
     * Given two arrays, return all items which exist in the left but not the right
     * @param {any[]} lArr 
     * @param {any[]} rArr 
     */
    leftOuter: function (lArr, rArr) {
        rSet = new Set(rArr);
        return [...lArr].filter(u => !rSet.has(u));
    },

    /**
     * Format the list of who needs to ready up or return the everyone tag
     * @param {DISCORD.User[]} users 
     */
    whoToReady: function (users) {
        var out = users.join(", ");
        return out || CON.HERE;
    }
}
const DISCORD = require("discord.js");

const CON = require('./constants.js');

module.exports = {
    /**
     * Post a default error message with the given reason if present
     * @param {DISCORD.Channel} channel 
     * @param {string} reason 
     */
    errorMsg: function (reason = "") {
        return `${reason.length ? reason + " " : ""}Type \`/${CON.HELP}\` for a list of commands.`;
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
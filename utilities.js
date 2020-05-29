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
        channel.send(`To start a ready check:\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} <number>\`\`\`To ready-up:\`\`\`${CON.PREFIX}${CON.READY_CMD}\`\`\`To see how many people need to ready-up:\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} ${CON.CHECK_NUM_CMD}\`\`\``);
    },

    plural: function (val) {
        return (val != 1 ? "s" : "");
    },

    /**
     * Format the list of who needs to ready up or return the everyone tag
     * @param {DISCORD.User[]} users 
     */
    whoToReady: function (users) {
        var out = "";
        users.forEach(user => {
            out += user.username + ", ";
        });
        return out || CON.EVERY;
    }
}
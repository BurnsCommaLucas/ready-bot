const DISCORD = require("discord.js");

const CON = require('./constants.js');

module.exports = {
    /**
     * 
     * @param {DISCORD.Channel} channel 
     * @param {string} reason 
     */
    errorMsg: function (channel, reason = "") {
        channel.send(`${reason.length ? reason + " " : ""}Type \`${CON.PREFIX}${CON.READY_CMD} ${CON.HELP_CMD}\` for a list of commands.`);
    },

    /**
     * 
     * @param {DISCORD.Channel} channel 
     */
    helpMsg: function (channel) {
        channel.send(`To start a ready check:\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} <number>\`\`\`\
To ready-up:\`\`\`${CON.PREFIX}${CON.READY_CMD}\`\`\`\
To see how many people need to ready-up:\`\`\`${CON.PREFIX}${CON.CHECK_READY_CMD} ${CON.CHECK_NUM_CMD}\`\`\``);
    },

    plural: function (val) {
        return (val != 1 ? "s" : "");
    },

    /**
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
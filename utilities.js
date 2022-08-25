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
    * @param {DISCORD.CommandInteraction} interaction
    * @param {string | DISCORD.MessagePayload | DISCORD.InteractionReplyOptions} options
    */
    safeRespond: async function (interaction, options) {
        try {
            if (interaction.replied) return;
            await interaction.reply(options);
            return true;
        } catch (error) {
            console.warn("Failed to reply to interaction:", interaction, options)
            console.trace();
        }
    },

    /**
     * @param {number} val
     */
    plural: function (val, pluralizer = "s") {
        return (val != 1 ? pluralizer : "");
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
     * @param {DISCORD.GuildMember[]} users 
     */
    whoToReady: function (users) {
        var out = users.map(member => member.user).join(", ");
        return out;
    }
}
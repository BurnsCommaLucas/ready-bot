const con = require('./constants.js');
module.exports = {

    errorMsg: function (chan, reason) {
        chan.send((typeof reason == 'undefined' ? "" : reason + " ") + "Type ```" + con.PREFIX + con.READY_CMD + " " + con.HELP_CMD + "``` for a list of commands.");
    },

    helpMsg: function (chan) {
        chan.send("To start a ready check:```" + con.PREFIX + con.CHECK_READY_CMD + " <number>" +
        "```To ready-up:```" + con.PREFIX + con.READY_CMD +
        "```To see how many people need to ready-up:```" + con.PREFIX + con.CHECK_READY_CMD + " " + con.CHECK_NUM_CMD + "```");
    },

    plural: function (val) {
        return (val != 1 ? "s" : "");
    }
}
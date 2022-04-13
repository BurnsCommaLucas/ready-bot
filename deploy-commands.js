const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const CON = require("./constants.js");
require("dotenv").config();

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

const commands = [
    {
        name: CON.CHECK.CREATE,
        description: "Create a ready check",
        options: [
            {
                name: CON.CHECK.CREATE_NUM_TARGET,
                description: "The number of users to ready",
                type: 4
            },
            {
                name: CON.CHECK.CREATE_MENTION_TARGET,
                description: "The users/roles to ready",
                type: 3
            }
        ]
    },
    {
        name: CON.READY,
        description: 'Respond "Ready" to a ready check'
    },
    {
        name: CON.UNREADY,
        description: 'Respond "Not Ready" to a ready check'
    },
    {
        name: CON.STATUS,
        description: "See who still needs to ready"
    },
    {
        name: CON.HELP,
        description: "Get help using ready-bot"
    },
    {
        name: CON.CONTRIBUTE,
        description: "Get details about ready-bot and how to contribute to its development"
    }
];

(async () => {
    try {
        console.log('Registering slash-commands...');

        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            { body: commands }
        );

        console.log("Success")
    } catch (error) {
        console.error(error);
    }
})();
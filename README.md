# ready-bot
[![Discord Bots](https://top.gg/api/widget/status/389210640612589568.svg)](https://top.gg/bot/389210640612589568)
[![Discord Bots](https://top.gg/api/widget/servers/389210640612589568.svg)](https://top.gg/bot/389210640612589568)

<a href="https://travis-ci.org/BurnsCommaLucas/ready-bot" target="_blank" src="https://travis-ci.org/BurnsCommaLucas/ready-bot.svg?branch=master"></a>

A WoW style ready-check bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://heroku.com).

[Click here to add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot) (You need to have server management  permissions to add the bot.)

If you like the bot, [vote for it on top.gg!](https://top.gg/bot/389210640612589568) It helps other people find the bot!

## Usage

Once you add the bot to your server, start a ready check with:

```
!cready <number>
```
and have players ready-up with 
```
!ready
```
Full usage can be found by typing 
```
!ready help
```
Ready checks can be overridden by another instance of the first command, and checks will only be performed if the number entered is greater than 0. The person who initiates the ready check may also respond to the check as ready.

If you experience any unusual behavior from the bot or think of a feature that could be added, please open an issue ticket. 

## Planned Improvements

- Disable @everyone mention on check initiation
- Disable mention for ready-checker upon completion of check
- @everyone upon completion of check
- @ only the people involved in the check
- Remove members as ready-check candidates
- Specify members as ready-check candidates

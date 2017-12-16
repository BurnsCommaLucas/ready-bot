# ready-bot

![Travis CI build status](https://travis-ci.org/BurnsCommaLucas/ready-bot.svg?branch=master)

A WoW style ready-check bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://heroku.com), with constant integration testing through [Travis CI](https://travis-ci.org).

[Click here to add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot) (You need to have server management  permissions to add the bot.)


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

- Option to disable @everyone mention on check initiation
- Option to disable mention for ready-checker upon completion of check
- Option to @everyone upon completion of check
- Option to remove members as ready-check candidates
- Option to specify members as ready-check candidates

# ready-bot

[//]: [![Heroku](https://heroku-badge.herokuapp.com/?app=ready-bot&style=flat&svg=1)](https://github.com/pussinboots/heroku-badge)

A WoW style ready-check handler bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://dashboard.heroku.com). 

To get this bot on your server, [use this link](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot) and add the bot to the server you want. (You need to have server management  permissions to add the bot.)


## Usage

Once you add the bot to your server, start a ready check with:

```
!cready <number>
```
Now that a ready check is active, players can respond with 
```
!ready
```
To see how many players still need to ready, use
```
!cready ?
```
Ready checks can be overridden by another instance of the first command, and checks will only be performed if the number entered is greater than 0. The person who initiates the ready check may also respond to the check as ready.

If you experience any unusual behavior from the bot, or think of a feature that could be added, please open an issue ticket. 

---
## Planned Improvements

- Option to un-ready self from check
- Option to disable @everyone mention on check initiation
- Option to disable mention for ready-checker upon completion of check
- Option to @everyone upon completion of check
- Option to remove members as ready-check candidates
- Option to specify members as ready-check candidates
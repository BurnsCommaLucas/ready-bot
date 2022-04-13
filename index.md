# [ready-bot](https://burnscommalucas.github.io/ready-bot/)
[![Discord Bots](https://top.gg/api/widget/status/389210640612589568.svg)](https://top.gg/bot/389210640612589568)
[![Discord Bots](https://top.gg/api/widget/servers/389210640612589568.svg)](https://top.gg/bot/389210640612589568)

A WoW style ready-check bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://heroku.com).

[Click here to add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot)

If you like the bot, [vote for it on top.gg!](https://top.gg/bot/389210640612589568) It helps other people find the bot.

Want to support development of this bot, ask for a feature, or report a bug? Come to our [homepage](https://burnscommalucas.github.io/ready-bot/) or [GitHub](https://github.com/BurnsCommaLucas/ready-bot).

---

## Planned Improvements
To meet Discord's changing privacy guidelines, ready-bot will move soon from using `!` commands to `/` commands! This will let us offer better integration with Discord as well as keeping your message data totally private. 

For current users, here's what will change when `/` commands are added:

| Action                    | Current Command | Upcoming "Slash Command" |
| ------------------------- | --------------- | ------------------------ |
| Create a check            | `!cready`       | `/check`                 |
| See who is not ready      | `!cready ?`     | `/who`                   |
| Mark yourself "ready"     | `!ready`        | `/ready`                 |
| Mark yourself "not ready" | `!unready`      | `/unready`               |
| See usage instructions    | `!ready help`   | `/help`                  |
| Get a link to the GitHub  | `!contribute`   | `/docs`                  |

---

## Usage

Once you add the bot to your server, start a ready check for a number of players with:

```
!cready <number>
```
or check for specific players with
```
!cready <user tag> <user tag> ...
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

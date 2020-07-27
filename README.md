# ready-bot
[![Discord Bots](https://top.gg/api/widget/status/389210640612589568.svg)](https://top.gg/bot/389210640612589568)
[![Discord Bots](https://top.gg/api/widget/servers/389210640612589568.svg)](https://top.gg/bot/389210640612589568)

A WoW style ready-check bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://heroku.com).

[Click here to add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot) (You need to have server management  permissions to add the bot.)

If you like the bot, [vote for it on top.gg!](https://top.gg/bot/389210640612589568) It helps other people find the bot! Want to support development of this bot? Find me on [Ko-Fi](https://ko-fi.com/burnscommalucas) or find the bot on [GitHub](https://github.com/BurnsCommaLucas/ready-bot).

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

---

## Planned Improvements

- [ ] Create checks on a per-user-per-channel basis instead of 1 per channel
- [ ] Disable @everyone mention on check initiation
- [ ] Disable mention for ready-checker upon completion of check
- [ ] @everyone upon completion of check
- [ ] Remove members as ready-check candidates
- [x] Specify members as ready-check candidates
- [x] @ only the people involved in the check

# ready-bot
[![Discord Bots](https://top.gg/api/widget/status/389210640612589568.svg)](https://top.gg/bot/389210640612589568)
[![Discord Bots](https://top.gg/api/widget/servers/389210640612589568.svg)](https://top.gg/bot/389210640612589568)

## Important Update:

This version of ready-bot will be retired [Saturday, April 22nd 2023 around 1:00 pm PDT](https://time.is/compare/0100PM_22_Apr_2023_in_PDT) and replaced with a new, functionally 
identical version. There will likely be some intermittent outages for an hour or two at that time as I work to stand up and verify the new bot. For more details on this update, 
you can read [the FAQ section in the new repo](https://github.com/BurnsCommaLucas/ready-botlin/#faq) or start a discussion in the support server linked below if you have questions.

---

A WoW style ready-check bot for [Discord](https://discordapp.com) servers. Built and deployed automatically through [Heroku](https://heroku.com).

[Click here to add this bot to your server.](https://discordapp.com/oauth2/authorize?client_id=389210640612589568&scope=bot) (You need to have server management  permissions to add the bot.)

If you like the bot, [vote for it on top.gg!](https://top.gg/bot/389210640612589568) It helps other people find the bot! Want to support development of this bot? Find the bot on [GitHub](https://github.com/BurnsCommaLucas/ready-bot).

If you need help with ready-bot, you can open an issue in GitHub or head over to the [ready-bot support server](https://discord.gg/uwkF27Gt9M).

---

## Usage

Once you add the bot to your server, start a ready check for a number of users with:

```
/check count:<number>
```
or check for specific users with
```
/check mentions:<user tag> <user tag> ...
```
and have users ready-up with 
```
/ready
```
Full usage can be found by typing 
```
/help
```
Ready checks can be overridden by invoking the /check command again, and checks will only be performed if the `count` or number of `mentions` (of non-bot members) entered is greater than 0. The person who initiates the ready check may also respond to the check as ready.

If you experience any unusual behavior from the bot or think of a feature that could be added, please open an issue here.

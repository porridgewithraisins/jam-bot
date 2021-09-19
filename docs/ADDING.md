# Adding jam-bot to a server

Once you've [created an application and obtained your token](TOKEN.md), follow
these steps to add your bot to a server.

1. Go to the
   [Discord developer portal](https://discord.com/developers/applications).
2. Select the application you created and go to the OAuth2 section.
3. Scroll down to "OAuth2 URL generator" and check the `bot` box.
4. Next, scroll down to "Bot Permissions" and grant it the following
   permissions:
   - Send Messages
   - Public Threads
   - Manage Messages (for the clean feature)
   - Embed Links
   - Read Message History
   - (Under Voice Permissions) Speak
   - (Under Voice Permissions) Connect
5. Finally, copy and navigate to the URL that appeared at the bottom of the
   Scopes box. It should look something like this:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID_HERE&permissions=34362976256&scope=bot
```

You can also directly add your Client ID from the OAuth page into the above URL
and navigate to it to add the bot.

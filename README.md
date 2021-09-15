# jam-bot

A discord music bot. Aims to replicate a lot of the (deceased) Rythm's features. It is not a public bot, you will need to host it yourself.

<hr>

## Installation

Confirm that Node.js is installed with
```bash
node -v
```

You need to have Node.js v14 LTS installed (this is the default, but in case you installed a higher version for a different reason).

If you need to have a different node version system-wide, then you can install Node.js v14 just for this folder with
```bash
npm i node@v14-lts
```

For certain songs, [ffmpeg](https://www.ffmpeg.org/) needs to be installed due to the nature of their encoding. Linux systems mostly have this installed by default. But if you run another OS you will need to install it. (It is a useful program overall anyway)

In a terminal, run
```bash
mkdir musicbot
cd musicbot
npm init -y
npm i jambot
```
You can ignore these warnings

<img src = "https://i.imgur.com/hHwdTHn.png" width = 400 alt = "you can ignore discordjs unsupported engine errors">

<hr>

## Usage

Place a javascript file named whatever you like in the `musicbot` folder with the following contents
```js
const bot = require("jambot/bin/Jambot");

//so that discordjs shuts up.
global.AbortController = require('node-abort-controller').AbortController;

bot.init({
    token: "your_token_here",
    prefix: "!",
});
```
That's it!

Now fill the token field with your actual bot token, and the prefix field with whatever you'd like the command prefix to be (even multiple characters are fine)


Then run this file like so:
```
node name_of_file.js
```
Add the bot to your server

Send `!ping` in a text channel to confirm the bot is working, and then join a voice channel, and send `!help` to see all available commands. 

You can employ the same instance of the bot across multiple servers, as your computer's resources allow.

<hr>

## Updates

You can run `npm update` in a terminal opened to the `musicbot` folder you created for the bot, to update the package if it is available.

<hr>

## Uninstall

There is no effect outside the `musicbot` folder you created for the bot. So simply deleting the folder suffices.

<hr>

## Note

- Spotify / Soundcloud support is yet to be added.

<hr>

## Known bugs

There is a problem with the audio stream, so songs randomly stop playing.Relevant issue tracker : https://github.com/fent/node-ytdl-core/issues/902

[Workaround] [Is Implemented] Use node v14 even though discordjs complains.

    
<hr>

## Bugs/Feature requests

Submit an issue in this Github repo.

<hr>

## Todo

-   [x] Full suite of playback commands
-   [x] Add queue support
-   [x] REPL for every command
-   [x] Test fully on an actual server
-   [x] Make all commands part of a single interface, to decouple app.ts from the actual commands.
-   [x] Support custom prefixes
-   [x] Duplicate Rythms !search feature
-   [x] Playlist support (spotify unsupported for now)
-   [x] Add looping capabilities
-   [x] Make youtube search better
-   [x] music.youtube.com support
-   [ ] Add pagination for !queue command.
-   [ ] Enable guilds to save playlists to use later
-   [ ] Add message managing features similar to rythm's !clean to remove the bot's clutter from text channels

# jam-bot

A discord music bot. Aims to replicate a lot of the (deceased) Rythm's features. It is not a public bot, you will need to host it yourself. Although intended for small-scale usage, it does support running on multiple guilds.

## Requirements

You will need the latest node.js installed (Discord.js demands the latest (atleast 16.1), and will not run on the LTS version). Unix users can use the node version manager `n` to upgrade to the latest version.

```
npm install -g n
sudo n latest
```

Windows users will have to re-download the [latest version](https://nodejs.org/en/download/current).

Discord.js voice interactions may require [ffmpeg](https://www.ffmpeg.org/) (for audio encoding) installed as well.

## Known bugs

ytdl-core seems to have problems with the audio stream, so songs randomly stop playing. For now, this is gracefully handled by skipping the song. Relevant issue tracker : https://github.com/fent/node-ytdl-core/issues/902

There is a hacky fix for now (built into this package). As and when the issue there gets fixed, this package will update to reflect it.

## Bugs/Feature requests

Submit an issue in this Github repo.

## Todo

-   [x] Full suite of playback commands
-   [x] Add queue support
-   [x] REPL for every command
-   [x] Test fully on an actual server
-   [x] Make all commands extend a single interface, to decouple app.ts from the actual commands.
-   [x] Support custom prefixes
-   [x] Duplicate Rythms !search feature
-   [x] Playlist support (spotify unsupported for now)
-   [x] Add looping capabilities
-   [x] Make youtube search better
-   [x] music.youtube.com support
-   [ ] Enable guilds to save playlists to use later
-   [ ] Add message managing features similar to rythm's !clean to remove the bot's clutter from text channels

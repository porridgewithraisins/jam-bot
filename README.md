# jam-bot

A discord music bot. Aims to replicate a lot of the (deceased) Rythm's features. It is not a public bot, you will need to host it yourself. Although intended for small-scale usage, it does support running on multiple guilds.

## Usage

Although discord.js demands the latest node.js, this library works fine on the regular LTS version of node.
Moreover, there is currently a bug with a dependency that demands Node 14 LTS be used. If you happen to have another version of node installed, run
```
npm i node@v14-lts
```
to install node 14lts in the current folder only

## Installation

Confirm that node is installed with
```
node -v
```
Create a folder for the bot. Then open the folder 

## Known bugs

There is a problem with the audio stream, so songs randomly stop playing. Using Node 14 alleviates the issue. Relevant issue tracker : https://github.com/fent/node-ytdl-core/issues/902


## Bugs/Feature requests

Submit an issue in this Github repo.

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

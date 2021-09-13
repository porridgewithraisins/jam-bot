# jam-bot

A discord music bot. Aims to replicate a lot of the (deceased) Rythm's features. It is not a public bot, you will need to host it yourself. Although intended for small-scale usage, it does support running on multiple guilds.

## Requirements

You will need the latest node.js installed (Discord.js demands the latest (atleast 16.1), and will not run on the LTS version). Unix users can use the node version manager `n` to upgrade to the latest version.

```
npm install -g n
sudo n latest
```
 Windows users will have to re-download the [latest version](https://nodejs.org/en/download/current).

 

## Setup

Get the yarn package manager
```
npm install -g yarn
```
Clone this repo
```
git clone https://github.com/porridgewithraisins/jam-bot/ -- depth 1
```
Cd into the folder and install dependencies
```
cd jam-bot
yarn
```
Create a `.env` file in the `jam-bot/` directory containing the bot's secret token.
```
TOKEN=YOUR_TOKEN_HERE
```
Build the typescript project into javascript
```
yarn build
```

## Usage

In the `jam-bot` directory, simply run

```
yarn start
```

anytime you want the bot online. Once the bot is online, you can send _help in the channel to see available commands.

### Changing prefix (Default is _ )
In the `Constants.ts` file, simply change the prefix to anything you like. Note that anytime you make a change to a `.ts` file, you will need to run `yarn build` to effect those changes in the JavaScript.

### Bugs/Feature requests
Submit an issue in this Github repo.

## Todo

-   [x] Full suite of playback commands
-   [x] Add queue support
-   [x] REPL for every command
-   [x] Test fully on an actual server
-   [x] Make all commands extend a single interface, to decouple app.ts from the actual commands.
-   [x] Support custom prefixes
-   [x] Duplicate Rythms !search feature
-   [ ] Playlist support (spotify too?)
-   [ ] Move audio player to worker thread to avoid the tiny playback stutter that may occur while processing other commands
# jam-bot

A self-hosted Discord music bot. Aims to be a feature-compatible replacement for
recently taken-down bots like Rythm and Groovy.

https://www.npmjs.com/package/jambot

---

## Usage

### Prerequisites

You need to have Node.js v14 LTS installed<sup> [1](#known-bugs)</sup>. This is
the default version, but in case you need to have a different node version
system-wide, you can install v14 for jam-bot alone by running

```bash
npm i node@v14-lts
```

in your terminal.

Confirm that Node.js is installed by running

```bash
node -v
```

Certain tracks will need [ffmpeg](https://www.ffmpeg.org/) to be decoded. A lot
of systems may already have this installed, but you will need to
[install it yourself](https://ffmpeg.org/download.html) if you do not have it.

### Installing

Once the prerequisites are satisfied, run the following commands one after the
other in a terminal.

```bash
mkdir musicbot
cd musicbot
npm init -y
npm i jambot --only=prod
```

You can ignore these warnings

<img src="https://i.imgur.com/hHwdTHn.png" width=400 alt="unsupported engine warnings from discord.js">

---

## Usage

Place a javascript file named `jambot.config.js` (Or whatever else you like) in
the `musicbot` folder with the following contents

```js
const bot = require("jambot/Jambot");

global.AbortController = require("node-abort-controller").AbortController;

bot.init({
  token: "your_token_here",
  prefix: "!",
});
```

That's it!

Now fill the token field with [your actual bot token](docs/TOKEN.md), and the
prefix field with whatever you'd like the command prefix to be (even multiple
characters are fine).

Run this file with the following command:

```
node jambot.config.js
```

[Add the bot to your server.](docs/ADDING.md)

Use the `!ping` command in a text channel to confirm the bot is working, join a
voice channel, and use `!help` to see all available commands. (Note that you
will need to change the prefix depending on what you configured it as)

You can employ the same instance of the bot across multiple servers, but this
depends on your computer's resources.

---

## Development

Clone this repo, and install all dependencies with

```
git clone https://github.com/porridgewithraisins/jam-bot
cd jam-bot
npm i
```

---

## Updates

You can run `npm update` in a terminal opened to the `musicbot` folder you
created for the bot, to update the package if it is available.

---

## Uninstall

There is no effect outside the `musicbot` folder you created for the bot. So
simply deleting the folder suffices.

---

## Known bugs

- _Description_: There is a problem with the audio stream returned by ytdl on
  node.js v16. Relevant issue tracker :
  https://github.com/fent/node-ytdl-core/issues/902

  _Status_: Workaround implemented - Using node v14 even though discordjs
  complains. [AbortController](https://www.npmjs.com/package/node-abort-controller) is also required

---

## Bugs/Feature requests

Submit an issue in this Github repo.

---

## Changelog

- 1.1.6 When multiple instances of the bot are running in the same guild, bots only respond to commands sent by members it shares a voice channel with.
- 1.1.5 Add better queue management and support ranges everywhere indexes are
  supported, such as in !search
- 1.1.4 Fix youtube search issue.
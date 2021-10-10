const bot = require("./bin/Jambot");
require("dotenv").config();

bot.init({
    token: process.env.DISCORD_BOT_TOKEN,
    prefix: "!",
    permissions: {
        musician: ["skip", "quit"],
    },
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    autoDeleteAfter: 300,
    idleTimeout: 15,
});

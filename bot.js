const bot = require("./bin/Jambot");
require("dotenv").config();

bot.init({
    token: process.env.DISCORD_BOT_TOKEN,
    prefix: "!",
    permissions: {},
    allowUnattended: false,
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    periodicallyLogPerformance: true,
    autoDeleteAfter: 60,
});

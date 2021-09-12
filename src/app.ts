import { Client, Collection, Intents } from "discord.js";
import dotenv from "dotenv";
import { Help } from "./commands/help";

import { MusicPlayer } from "./commands/music-player";
import { Ping } from "./commands/ping";
import { getCmd, getArg, removeLinkMarkdown } from "./utils/message";

dotenv.config();

const prefix = "_";

const queueMap = new Collection<string, MusicPlayer>();

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
client.login(process.env.TOKEN);

client.on("ready", async () => console.log("ready"));

client.on("messageCreate", async (message) => {
    if (
        !message.content.startsWith(prefix) ||
        message.author.bot ||
        !message.guild
    ) {
        return;
    }

    if (message.content === "_ping") {
        new Ping().execute(message);
        return;
    }

    if (message.content === "_help") {
        new Help().execute(message);
        return;
    }

    if (!message.member?.voice.channel) {
        message.reply("You need to be in a voice channel first");
        return;
    }

    const id = message.guild.id;
    if (!queueMap.has(id)) {
        queueMap.set(id, new MusicPlayer(message, () => queueMap.delete(id)));
    }
    const queue = queueMap.get(id) as MusicPlayer;
    queue.execute(
        getCmd(removeLinkMarkdown(message.content)),
        getArg(removeLinkMarkdown(message.content))
    );
});

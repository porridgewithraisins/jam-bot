import { Client, Collection } from "discord.js";
import dotenv from "dotenv";

import { MusicPlayer } from "./commands/MusicPlayer";
import { Ping } from "./commands/Ping";
import { INTENTS, PREFIX } from "./Constants";
import { getCmd, getArg, removeLinkMarkdown, prefixify } from "./Message";

dotenv.config();

const queueMap = new Collection<string, MusicPlayer>();

const client = new Client({
    intents: INTENTS,
});
client.login(process.env.TOKEN);

client.on("ready", async () => console.log("ready"));

client.on("messageCreate", async (message) => {

    //irrelevant messages
    if (
        !message.content.startsWith(PREFIX) ||
        message.author.bot ||
        !message.guild
    ) {
        return;
    }

    //handle those that work without a voice channel, here itself.
    if (message.content === prefixify("ping")) {
        new Ping().execute(message);
        return;
    }

    //need voice channel for playing music
    if (!message.member?.voice?.channel) {
        message.reply("You need to be in a voice channel first");
        return;
    }
    const id = message.guild.id;
    if (!queueMap.has(id)) {
        queueMap.set(
            id,
            new MusicPlayer({
                text: message.channel,
                voice: message.member.voice.channel,
                adapter: message.guild.voiceAdapterCreator,
                onQuitCallback: () => queueMap.delete(id),
            })
        );
    }
    const queue = queueMap.get(id) as MusicPlayer;
    queue.execute(
        getCmd(removeLinkMarkdown(message.content)),
        getArg(removeLinkMarkdown(message.content))
    );
});
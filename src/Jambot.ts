import { Client, Collection, Message } from "discord.js";

import { MusicPlayer } from "./commands/MusicPlayer";
import { Ping } from "./commands/Ping";
import { getConfig, setConfig } from "./Config";
import { INTENTS } from "./Constants";
import { getCmd, getArg, removeLinkMarkdown, prefixify } from "./Message";
import { Config } from "./types";

type GuildID = string;

const MusicPlayers = new Collection<GuildID, MusicPlayer>();

const client = new Client({
    intents: INTENTS,
});

export function init(config: Config) {
    setConfig(config);
    client.login(getConfig().token);

    client.on("ready", async () => console.log("ready"));

    client.on("messageCreate", messageHandler);
}

const messageHandler = (message: Message) => {
    if (
        !message.content.startsWith(getConfig().prefix) ||
        message.author.bot ||
        !message.guild
    ) {
        return;
    }

    if (message.content === prefixify("ping")) {
        new Ping().execute(message);
        return;
    }

    if (!message.member?.voice?.channel) {
        message.reply("You need to be in a voice channel first");
        return;
    }

    const id: GuildID = message.guild.id;
    if (!MusicPlayers.has(id)) {
        MusicPlayers.set(
            id,
            new MusicPlayer({
                text: message.channel,
                voice: message.member.voice.channel,
                adapter: message.guild.voiceAdapterCreator,
                onQuitCallback: () => MusicPlayers.delete(id),
            })
        );
    }
    const playerForGuild = MusicPlayers.get(id) as MusicPlayer;
    playerForGuild.execute(
        getCmd(removeLinkMarkdown(message.content)),
        getArg(removeLinkMarkdown(message.content))
    );
};

import * as process from "process";
import * as discordJs from "discord.js";
import * as Utils from "./common/Utils";
import * as Views from "./services/Views";
import { Ping } from "./commands/Ping";
import { MusicPlayer } from "./commands/MusicPlayer";
import { Config, configObj } from "./config/Config";
import { credentials } from "./config/Credentials";

const client = new discordJs.Client({
    intents: [
        discordJs.Intents.FLAGS.GUILDS,
        discordJs.Intents.FLAGS.GUILD_MESSAGES,
        discordJs.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});

const initConfig = async (options: Config) => {
    try {
        configObj.load(options);
    } catch (e: any) {
        console.error("Configuration error:", e.message);
        process.exit(1);
    }
    if (configObj.spotify) {
        try {
            await credentials.refreshSpotifyAccessToken();
        } catch (e: any) {
            console.error(e.message);
            process.exit(1);
        }
    }
};

export function init(options: Config) {
    initConfig(options);
    client.login(configObj.token);

    client.on("ready", onReady);

    client.on("messageCreate", onMessage);
}

type GuildID = string;

const MusicPlayers = new discordJs.Collection<GuildID, MusicPlayer>();

const onReady = async (client: discordJs.Client) => {
    try {
        await client.user?.setAvatar("assets/jambot.png");
    } catch (e) {}

    console.log("JamBot is ready to go!");
};

const onMessage = async (message: discordJs.Message) => {
    if (
        !message.content.startsWith(configObj.prefix) ||
        message.author.bot ||
        !message.guild ||
        (message.guild.me &&
            message.guild.me.voice &&
            message.guild.me.voice.channel &&
            message.member &&
            message.member.voice &&
            message.member.voice.channel &&
            message.guild.me.voice.channel.id !==
                message.member.voice.channel.id)
    ) {
        return;
    }

    if (message.content === Utils.prefixify("ping")) {
        new Ping().execute(client, message);
        return;
    }

    if (message.content.trim() === Utils.prefixify("help")) {
        message.reply({ embeds: [Views.helpView()] });
        return;
    }

    if (!message.member?.voice?.channel) {
        message.reply("You need to be in a voice channel first");
        return;
    }

    const id: GuildID = message.guild.id;
    if (!MusicPlayers.has(id) && message.content !== Utils.prefixify("quit")) {
        MusicPlayers.set(
            id,
            new MusicPlayer({
                textChannel: message.channel,
                initialVoiceChannel: message.member.voice.channel,
                adapterCreator: message.guild.voiceAdapterCreator,
                onQuitCallback: () => MusicPlayers.delete(id),
            })
        );
    }

    const playerForThisGuild = MusicPlayers.get(id);
    if (playerForThisGuild) playerForThisGuild.controller(message);
};

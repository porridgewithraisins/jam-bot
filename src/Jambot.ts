import * as process from "process";
import * as discordJs from "discord.js";
import * as MusicPlayer from "./commands/MusicPlayer";
import * as Ping from "./commands/Ping";
import * as Config from "./config/Config";
import * as Utils from "./common/Utils";
import * as Types from "./common/Types";

const client = new discordJs.Client({
    intents: [
        discordJs.Intents.FLAGS.GUILDS,
        discordJs.Intents.FLAGS.GUILD_MESSAGES,
        discordJs.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
export function init(config: Types.Config) {
    Config.setConfig(config);
    if (config.logPerformance)
        setInterval(() => console.log(process.resourceUsage()), 600_000);

    client.login(Config.getConfig().token);

    client.on("ready", onReady);

    client.on("messageCreate", onMessage);
}

type GuildID = string;

const MusicPlayers = new discordJs.Collection<
    GuildID,
    MusicPlayer.MusicPlayer
>();

const onReady = async (client: discordJs.Client) => {
    await client.user?.setAvatar("assets/jambot.jpg");
    console.log("JamBot is ready to go!");
};

const onMessage = async (message: discordJs.Message) => {
    if (
        !message.content.startsWith(Config.getConfig().prefix) ||
        message.author.bot ||
        !message.guild
    ) {
        return;
    }

    if (message.content === Utils.prefixify("ping")) {
        new Ping.Ping().execute(client, message);
        return;
    }

    if (!message.member?.voice?.channel) {
        message.reply("You need to be in a voice channel first");
        return;
    }
    if (
        message.guild.me &&
        message.guild.me.voice &&
        message.guild.me.voice.channel &&
        message.guild.me.voice.channel.id !== message.member.voice.channel.id
    ) {
        return;
    }
    const id: GuildID = message.guild.id;
    if (!MusicPlayers.has(id)) {
        MusicPlayers.set(
            id,
            new MusicPlayer.MusicPlayer({
                textChannel: message.channel,
                initialVoiceChannel: message.member.voice.channel,
                adapterCreator: message.guild.voiceAdapterCreator,
                onQuitCallback: () => MusicPlayers.delete(id),
            })
        );
    }

    const playerForGuild = MusicPlayers.get(id) as MusicPlayer.MusicPlayer;
    playerForGuild.controller(message.content);
};

import Collection from "@discordjs/collection";
import { Message, TextChannel, VoiceChannel } from "discord.js";
import { MusicPlayer } from "../models/MusicPlayer.Model";

type GuildId = string;
const musicPlayers = new Collection<GuildId, MusicPlayer>();

export const getMusicPlayer = (message: Message) => {
    const id = message.guild!.id;
    return musicPlayers.has(id)
        ? musicPlayers.get(id)
        : musicPlayers.set(id, musicPlayerFactory(message)).get(id);
};

const musicPlayerFactory = (message: Message) =>
    new MusicPlayer({
        textChannel: message.channel as TextChannel,
        voiceChannel: message.member!.voice.channel as VoiceChannel,
        onQuitCallback: () => musicPlayers.delete(message.guild!.id),
    });

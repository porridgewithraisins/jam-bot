import Collection from "@discordjs/collection";
import { Message, TextChannel, VoiceChannel } from "discord.js";
import { CommandRegistry } from "../commands/Command.Registry";
import { MusicPlayer } from "../models/MusicPlayer.Model";

type GuildId = string;
const musicPlayers = new Collection<GuildId, MusicPlayer>();

export const getMusicPlayerForGuild = (message: Message) => {
    const id = message.guild!.id;
    return musicPlayers.has(id)
        ? musicPlayers.get(id)
        : !CommandRegistry.quit.triggers.includes(message.content.trim())
        ? musicPlayers.set(id, musicPlayerFactory(message)).get(id)
        : undefined;
};

const musicPlayerFactory = (message: Message) =>
    new MusicPlayer({
        text: message.channel as TextChannel,
        voice: message.member!.voice.channel as VoiceChannel,
        onQuit: () => destroyMusicPlayer(message.guild!.id),
    });

export const destroyMusicPlayer = (guildId: string) => {
    musicPlayers.delete(guildId);
};

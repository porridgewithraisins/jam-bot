import * as discordJsVoice from "@discordjs/voice";
import * as discordJs from "discord.js";
import { MusicPlayer } from "../commands/MusicPlayer";
import * as Timer from "../services/Timer";

export interface MusicPlayerArgs {
    textChannel: discordJs.TextBasedChannels;
    initialVoiceChannel: discordJs.VoiceChannel | discordJs.StageChannel;
    adapterCreator: discordJsVoice.DiscordGatewayAdapterCreator;
    onQuitCallback?: () => any;
}

export interface Song {
    title: string;
    url: string;
    duration: string;
    thumbnail?: string;
    artist?: string;
}

export interface NowPlaying extends Song {
    elapsedTimer: Timer.ElapsedTimer;
}

export type SongSource = {
    src:
        | "youtube"
        | "youtube-playlist"
        | "youtube-search"
        | "spotify"
        | "spotify-playlist"
        | "spotify-album";
    meta?: string;
};

import * as discordJs from "discord.js";
import * as Timer from "../services/Timer";

export interface MusicPlayerArgs {
    textChannel: discordJs.TextBasedChannels;
    voiceChannel: discordJs.VoiceChannel | discordJs.StageChannel;
    onQuitCallback: () => {};
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

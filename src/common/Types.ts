import * as voice from "@discordjs/voice";
import * as discordJs from "discord.js";
import * as Timer from "../services/timer/Timer";

export interface Config {
    token: string;
    prefix: string;
    spotify?: {
        clientID: string;
        clientSecret: string;
    };
    localFolder?: string;
    logPerformance?: boolean;
}

export interface MusicPlayerArgs {
    textChannel: discordJs.TextBasedChannels;
    initialVoiceChannel: discordJs.VoiceChannel | discordJs.StageChannel;
    adapterCreator: voice.DiscordGatewayAdapterCreator;
    onQuitCallback?: () => any;
}
export interface MusicPlayerCommand {
    description?: string;
    triggers: string[];
    handler: (arg: string) => Promise<void>;
}
export interface MusicPlayerCommandMap {
    [name: string]: MusicPlayerCommand;
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

export type SongSource =
    | "youtube"
    | "youtube-playlist"
    | "youtube-search"
    | "spotify"
    | "spotify-playlist";

import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { StageChannel, TextBasedChannels, VoiceChannel } from "discord.js";

export interface Config {
    token: string;
    prefix: string;
}

export interface MusicPlayerArgs {
    text: TextBasedChannels;
    voice: VoiceChannel | StageChannel;
    adapter: DiscordGatewayAdapterCreator;
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
    timestamp: string;
    thumbnail?: string;
}

export interface YoutubeSearchResult {
    id: {
        videoId: any;
    };
    url: string;
    title: string;
    description: any;
    duration_raw: any;
    snippet: {
        url: string;
        duration: any;
        publishedAt: any;
        thumbnails: {
            id: any;
            url: any;
            default: any;
            high: any;
            height: any;
            width: any;
        };
        title: string;
        views: any;
    };
    views: any;
}
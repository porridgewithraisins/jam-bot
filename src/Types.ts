import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { StageChannel, TextBasedChannels, VoiceChannel } from "discord.js";
import { ElapsedTimer } from "./ElapsedTimer";

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
    duration: string;
    thumbnail?: string;
}

export interface NowPlaying extends Song {
    elapsedTimer: ElapsedTimer;
}

import { DiscordGatewayAdapterCreator } from "@discordjs/voice";
import { TextBasedChannels, VoiceChannel, StageChannel } from "discord.js";

export interface MusicPlayerArgs {
    text: TextBasedChannels;
    voice: VoiceChannel | StageChannel;
    adapter: DiscordGatewayAdapterCreator;
    onQuitCallback?: () => any;
}

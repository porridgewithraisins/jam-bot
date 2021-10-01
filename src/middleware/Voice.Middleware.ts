import { Message } from "discord.js";

export const voiceMiddleware = (message: Message): boolean =>
    Object.values({
        inAVoiceChannel: (message: Message): boolean => {
            if (!message.member?.voice?.channel) {
                message.reply("You need to be in a voice channel first");
                return false;
            }
            return true;
        },
        isNotStage: (message: Message): boolean =>
            message.member?.voice?.channel?.type === "GUILD_VOICE",
        isTextChannel: (message: Message): boolean =>
            message.channel.type === "GUILD_TEXT",
    }).every((check) => check(message));

import { Message } from "discord.js";
import { CommandRegistry } from "../commands/Command.Registry";

export const voiceMiddleware = (message: Message): boolean =>
    Object.values({
        notQuitCommand: (message: Message): boolean =>
            !CommandRegistry.quit.triggers.includes(message.content.trim()),

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

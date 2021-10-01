import { Message } from "discord.js";
import { configObj } from "../common/Config";

export const mainMiddleware = (message: Message): boolean =>
    Object.values({
        prefixPresent: (message: Message): boolean =>
            message.content.startsWith(configObj.prefix),

        notABot: (message: Message): boolean => !message.author.bot,

        isInGuild: (message: Message): boolean => !!message.guild,

        notInAVCOrSameVC: (message: Message): boolean => {
            // not in a VC
            if (!message.member?.voice?.channel) return true;

            if (!message.guild?.me?.voice?.channel) return true;

            // same VC
            return (
                message.member.voice.channel.id ===
                message.guild.me.voice.channel.id
            );
        },
    }).every((check) => check(message));

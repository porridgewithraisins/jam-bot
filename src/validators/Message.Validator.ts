import { Message } from "discord.js";
import { configObj } from "../common/Config";

export const messageValidator = (message: Message): boolean =>
    Object.values({
        prefixPresent: (message: Message): boolean =>
            message.content.startsWith(configObj.prefix),

        notABot: (message: Message): boolean => !message.author.bot,

        isInGuild: (message: Message): boolean => !!message.guild,

        notInAVCOrSameVC: (message: Message): boolean => {
            if (!message.member || !message.guild?.me) return false;
            // not in a VC
            if (!message.member.voice?.channel) return true;

            if (!message.guild.me.voice?.channel) return true;

            // same VC
            return (
                message.member.voice.channel.id ===
                message.guild.me.voice.channel.id
            );
        },
    }).every((check) => check(message));

export const __FOR__TESTING__ = { messageValidator };

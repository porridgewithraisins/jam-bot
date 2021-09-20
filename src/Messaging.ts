import { Message, MessageEmbed, TextBasedChannels } from "discord.js";
import { textView } from "./Views";

export const messenger = (
    to: TextBasedChannels | Message, // either send to a textchannel or reply to a message
    args: string | MessageEmbed | MessageEmbed[]
) => {
    const embeds =
        args instanceof Array
            ? args
            : typeof args === "string"
            ? [textView(args)]
            : [args];

    if (to instanceof Message) to.reply({ embeds });
    else to.send({ embeds });
};

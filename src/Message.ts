import { MessageEmbed } from "discord.js";
import { PREFIX } from "./Constants";
import { Song } from "./types/Song";

export {
    getArg,
    getCmd,
    removeLinkMarkdown,
    embedMessage,
    prefixify,
    mdHyperlinkSong,
};

const getArg = (content: string) => content.split(" ").slice(1).join(" ");
const getCmd = (content: string) => content.split(" ")[0];

const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content.at(-1) === ">")
        return content.slice(1, -1);
    return content;
};

const embedMessage = (text: string) => {
    return { embeds: [new MessageEmbed().setDescription(text)] };
};

const prefixify = (text: string) => PREFIX + text;

const mdHyperlinkSong = (song: Song) => `[${song.title}](${song.url})`;

import { MessageEmbed } from "discord.js";
import { getConfig } from "./Config";
import { Song } from "./types";

export {
    getArg,
    getCmd,
    removeLinkMarkdown,
    embedMessage,
    prefixify,
    mdHyperlinkSong,
    showDuration,
};

const getArg = (content: string) => content.split(" ").slice(1).join(" ");
const getCmd = (content: string) => content.split(" ")[0];

const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content.at(-1) === ">")
        return content.slice(1, -1);
    return content;
};

const embedMessage = (text: string, thumbnail?: string) => {
    let embed = new MessageEmbed().setDescription(text);
    if (thumbnail) embed.setThumbnail(thumbnail);
    return { embeds: [embed] };
};

const prefixify = (text: string) => getConfig().prefix + text;

const mdHyperlinkSong = (song: Song) => `[${song.title}](${song.url})`;

const millsecToMinSec = (ms: number) => [
    Math.floor(ms / 1000 / 60),
    Math.floor((ms / 1000) % 60),
];

const showDuration = (startTime: number, totalDuration: string) =>
    `**${millsecToMinSec(Date.now() - startTime).join(":")}/${totalDuration}**`;

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

const getArg = (content: string) =>
    content.split(" ").slice(1).join(" ").trim();
const getCmd = (content: string) => content.split(" ")[0].trim();

const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content[content.length - 1] === ">")
        return content.slice(1, -1);
    return content;
};

const embedMessage = (text: string, thumbnail?: string) => {
    let embed = new MessageEmbed().setDescription(text);
    if (thumbnail) embed.setThumbnail(thumbnail);
    return { embeds: [embed] };
};

const prefixify = (text: string) => getConfig().prefix + text;

const mdHyperlinkSong = (song: Song) => {
    if (song) return `[${song.title}](${song.url})`;
    else return "Error fetching details";
};

const millsecToMinSec = (ms: number) => [
    Math.floor(ms / 1000 / 60),
    Math.floor((ms / 1000) % 60),
];

const padOneZero = (x: number) => ("0" + x).slice(-2);

const showDuration = (startTime: number, totalDuration: string) =>
    `**${millsecToMinSec(Date.now() - startTime)
        .map(padOneZero)
        .join(":")}/${totalDuration}**`;

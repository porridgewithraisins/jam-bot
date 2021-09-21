import { getConfig } from "./Config";
import { Song } from "./Types";

export const getArg = (content: string) =>
    content.split(" ").slice(1).join(" ").trim();

export const getCmd = (content: string) => content.split(" ")[0].trim();

export const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content[content.length - 1] === ">")
        return content.slice(1, -1);
    return content;
};

export const prefixify = (text: string) => getConfig().prefix + text;

export const padOneZero = (x: number) => ("0" + x).slice(-2);

export const mdHyperlinkSong = ({
    title,
    url,
}: {
    title: string;
    url: string;
}) => `[${title}](${url})`;

export const durationToMs = (duration: string) => {
    const tokens = duration.split(":").map((x) => parseInt(x));
    if (tokens.length <= 2) {
        return (tokens[0] * 60 + (tokens[1] || 0)) * 1000;
    }
    return (tokens[0] * 3600 + tokens[1] * 60 + tokens[2]) * 1000;
};

export const millisecToHhMmSs = (ms: number) => {
    let time = Math.floor(ms / 1000);
    const ss = time % 60;
    time = Math.floor(time / 60);
    const mm = time % 60;
    time = Math.floor(time / 60);
    const hh = time % 60;
    return (hh ? [hh, mm, ss] : [mm, ss]).join(':');
};

export const removeTopicAtEnd = (artist: string) => {
    if (artist.slice(-8) === " - Topic") return artist.slice(0, -8);
    return artist;
};

export const clampAtZero = (x: number) => (x < 0 ? 0 : x);

export const mod = (x: number, m: number) => ((x % m) + m) % m;

export const coerceSize = (str: string, n: number) => {
    if (str.length > n) {
        return str.substr(0, n - 3) + "...";
    }
    if (str.length < n - 11) {
        return (
            str +
            "**" +
            Array(n - str.length - 11)
                .fill("\t")
                .join("") +
            "**"
        );
    }
    return str;
};

export const cleanDuration = (duration: string) => {
    const tokens = duration.split(":").map((x) => parseInt(x));
    if (tokens.some(isNaN)) return duration;
    return tokens.map(padOneZero).join(":");
};

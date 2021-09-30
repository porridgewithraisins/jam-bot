import { configObj } from "./Config";

export const removeLinkMarkdown = (content: string) => {
    if (content[0] === "<" && content[content.length - 1] === ">")
        return content.slice(1, -1);
    return content;
};

export const prefixify = (text: string) => configObj.prefix + text;

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

export const millisecToDuration = (ms: number) => {
    let time = Math.floor(ms / 1000);
    const ss = time % 60;
    time = Math.floor(time / 60);
    const mm = time % 60;
    time = Math.floor(time / 60);
    const hh = time % 60;
    return (hh ? [hh, mm, ss] : [mm, ss]).join(":");
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
    if (str.length < n) {
        /*TODO: Find a way to pad right with invisible characters in a way that works both on discord desktop and mobile */
    }
    return str;
};

export const padZeros = (duration: string) => {
    const tokens = duration.split(":").map((x) => parseInt(x));
    if (tokens.some(isNaN)) return duration;
    return tokens.map((x: number) => ("0" + x).slice(-2)).join(":");
};

export const prependHttp = (url: string, https = true) => {
    url = url.trim();

    if (/^\.*\/|^(?!localhost)\w+?:/.test(url)) {
        return url;
    }

    return url.replace(/^(?!(?:\w+?:)?\/\/)/, https ? "https://" : "http://");
};

export const __FOR__TESTING__ = {
    clampAtZero,
    coerceSize,
    durationToMs,
    mdHyperlinkSong,
    millisecToDuration,
    mod,
    padZeros,
    prefixify,
    prependHttp,
    removeLinkMarkdown,
    removeTopicAtEnd,
};

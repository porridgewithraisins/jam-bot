import ytpl, { Item } from "ytpl";
import * as yt from "youtube-search-without-api-key";
import ytdl, {
    getInfo,
    validateURL as validateSongURL,
} from "ytdl-core-discord";
import { Song, YoutubeSearchResult } from "./types";

export { searchYoutube, getSongs, getStream };

const searchYoutube = async (query: string): Promise<Song[]> => {
    const filterSearchResult = ({
        snippet: {
            title,
            url,
            duration,
            thumbnails: { url: thumbnailURL },
        },
    }: YoutubeSearchResult): Song => ({
        title,
        url,
        timestamp: duration,
        thumbnail: thumbnailURL as string,
    });

    let result: Song[] = [];
    try {
        result = (await yt.search(query)).map(filterSearchResult);
    } catch (e) {
        console.error(e);
    }
    return result;
};

const getPlaylist = async (arg: string, limit = Infinity): Promise<Song[]> => {
    const filterItems = ({
        title,
        url,
        duration,
        bestThumbnail: { url: thumbURL },
    }: Item): Song => ({
        title,
        url,
        timestamp: duration as string,
        thumbnail: thumbURL as string,
    });
    return (await ytpl(arg, { limit })).items.map(filterItems);
};

const getSongs = async (arg: string): Promise<Song[]> => {
    const toTimestamp = (seconds: string) => {
        const asInt = parseInt(seconds);
        const [min, sec] = [Math.floor(asInt / 60), asInt % 60];
        return `${min}:${sec}`;
    };

    if (validateSongURL(arg)) {
        const details = (await getInfo(arg)).videoDetails;
        return [
            {
                title: details.title,
                url: details.video_url,
                timestamp: toTimestamp(details.lengthSeconds),
                thumbnail: details.thumbnails[0].url,
            },
        ];
    }
    const match = /[&?]list=([a-z0-9_]+)/i.exec(arg)
    if (match) return getPlaylist(arg);
    const keywordSearchResult = await searchYoutube(arg);
    if (keywordSearchResult) return keywordSearchResult.slice(0, 1);
    return [];
    
};

const getStream = (song: Song) => {
    return ytdl(prependHttp(song.url), { filter: "audioonly" });
};

const prependHttp = (url: string, https = true) => {
    url = url.trim();

    if (/^\.*\/|^(?!localhost)\w+?:/.test(url)) {
        return url;
    }

    return url.replace(/^(?!(?:\w+?:)?\/\/)/, https ? "https://" : "http://");
};

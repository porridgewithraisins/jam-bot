import ytpl, { Item } from "ytpl";
import ytdl, * as ytdlCoreDiscord from "ytdl-core-discord";
import { Song } from "./Types";
import ytsr, { Video } from "ytsr";
export { searchYt, getSongs, getStream };

const searchYt = async (query: string): Promise<Song[]> => {
    const filterItems = ({
        title,
        url,
        bestThumbnail: { url: thumbnail },
        duration,
        author,
    }: ytsr.Video): Song => ({
        title,
        url,
        thumbnail: thumbnail || undefined,
        duration: duration || "4:42",
        artist: author?.name,
    });
    const results = await ytsr.getFilters(query);
    const typeFilter = results.get("Type");
    if (!typeFilter) return [];
    const videoFilter = typeFilter.get("Video");
    if (!videoFilter) return [];
    const url = videoFilter.url;
    if (!url) return [];
    const searchResults = (await ytsr(url, { pages: 1 })).items;
    return searchResults.map((item) => filterItems(item as Video));
};

const getPlaylist = async (arg: string, limit = Infinity): Promise<Song[]> => {
    const filterItems = ({
        title,
        url,
        duration,
        bestThumbnail: { url: thumbURL },
        author: { name },
    }: Item): Song => ({
        title,
        url,
        duration: duration as string,
        thumbnail: thumbURL as string,
        artist: name,
    });
    return (await ytpl(arg, { limit })).items.map(filterItems);
};

const getSongs = async (arg: string): Promise<Song[]> => {
    const toDuration = (seconds: string) => {
        const asInt = parseInt(seconds);
        const [min, sec] = [Math.floor(asInt / 60), asInt % 60];
        return `${min}:${sec}`;
    };
    if (ytdlCoreDiscord.validateURL(arg)) {
        const details = (await ytdlCoreDiscord.getInfo(arg)).videoDetails;
        return [
            {
                title: details.title,
                url: details.video_url,
                duration: toDuration(details.lengthSeconds),
                thumbnail: details.thumbnails[0].url,
                artist: details.author.name,
            },
        ];
    }

    const match = /[&?]list=([a-z0-9_]+)/i.exec(arg);
    if (match) return getPlaylist(arg);
    const keywordSearchResult = await searchYt(arg);
    return keywordSearchResult.slice(0, 1);
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

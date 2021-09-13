import ytSearch from "yt-search";
import ytdl, { getInfo, validateURL } from "ytdl-core";
import { Song } from "./types/Song";

export { searchSong, getSong, getStream };

const getUrl = async (validUrl: string) => {
    let result = undefined;
    try {
        result = (({ title, video_url: url }) => ({ title, url }))(
            (await getInfo(validUrl)).videoDetails
        );
    } catch (e) {
        console.error(e);
    }
    return result;
};

const searchSong = async (query: string) => {
    let result = undefined;
    try {
        result = (await ytSearch(query)).videos
            .slice(0, 20 - 1)
            .map(({ title, url }) => ({ title, url }));
    } catch (e) {
        console.error(e);
    }
    return result;
};

const getSong = async (input: string): Promise<Song | undefined> => {
    if (validateURL(input)) return getUrl(input);
    else {
        const searchResult = await searchSong(input);
        return searchResult ? searchResult[0] : undefined;
    }
};

const getStream = (song: Song) => ytdl(song.url, { filter: "audioonly" });

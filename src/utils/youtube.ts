import ytSearch from "yt-search";
import ytdl, { validateURL, getInfo } from "ytdl-core";
import { Song } from "../types/Song";

const getSong = async (query: string) => {
    if (validateURL(query)) {
        const { title, video_url } = (await getInfo(query)).videoDetails;
        return {
            title: title,
            url: video_url,
        };
    } else {
        const searchResult = (await ytSearch(query)).videos;
        return searchResult
            ? { title: searchResult[0].title, url: searchResult[0].url }
            : undefined;
    }
};

const getStream = (song: Song) => ytdl(song.url, { filter: "audioonly" });

export { getSong, getStream };
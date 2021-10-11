import * as ytsr from "ytsr";
import { Song } from "../models/Song.Model";

export const keywordSearch = async (query: string): Promise<Song[]> => {
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
        duration: duration || "00:00:00",
        artist: author?.name,
    });
    try {
        const searchResult = await ytsr.default(query, { pages: 1 });
        return searchResult.items
            .filter((item) => item.type === "video")
            .map((item) => filterItems(item as ytsr.Video));
    } catch {
        return [];
    }
};

export const searchOne = async (query: string): Promise<Song[]> =>
    (await keywordSearch(query)).slice(0, 1);

export const __FOR__TESTING__ = {
    keywordSearch,
    searchOne,
};

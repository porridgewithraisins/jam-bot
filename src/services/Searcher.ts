import * as ytsr from "ytsr";
import { Song } from "../common/Types";

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
        duration: duration || "42:42:42",
        artist: author?.name,
    });
    const results = await ytsr.getFilters(query);
    const typeFilter = results.get("Type");
    if (!typeFilter) return [];
    const videoFilter = typeFilter.get("Video");
    if (!videoFilter) return [];
    const url = videoFilter.url;
    if (!url) return [];
    const searchResults = (await ytsr.default(url, { pages: 1 })).items;
    return searchResults.map((item) => filterItems(item as ytsr.Video));
};

export const searchOne = async (query: string): Promise<Song[]> =>
    (await keywordSearch(query)).slice(0, 1);

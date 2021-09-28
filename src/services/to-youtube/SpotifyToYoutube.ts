import { Song } from "../../common/Types";
import { searchOne } from "../Searcher";

const queryStrategies = (song: Song) =>
    [
        song.title + " " + (song.artist || "") + " " + song.url,
        song.title + " " + (song.artist || ""),
    ].map((str) => str.replace(/ {2,}/g, " ").trim());

export const convertSpotifyInfoToYoutube = async (song: Song) => {
    for (const queryStrat of queryStrategies(song)) {
        const searchResult = (await searchOne(queryStrat))[0];
        if (searchResult) {
            const { duration, url } = searchResult;
            return { ...song, duration, url };
        }
    }
    return undefined;
};

export const __FOR__TESTING__ = {
    queryStrategies,
    convertSpotifyInfoToYoutube,
};

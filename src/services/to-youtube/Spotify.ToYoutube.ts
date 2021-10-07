import { Song } from "../../models/Song.Model";
import { searchOne } from "../Searcher";

const queryStrategies = (song: Song) =>
    [
        song.title + " " + (song.artist || "") + " " + song.url,
        //TODO: find more strategies
    ].map((str) => str.replace(/ {2,}/g, " ").trim());

export const convertSpotifyInfoToYoutube = async (song: Song) => {
    for (const queryStrat of queryStrategies(song)) {
        const searchResult = (await searchOne(queryStrat))[0];
        console.log(queryStrat);
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

import { Song } from "../common/Types";
import { getSongSource } from "./Fetcher";
import { convertSpotifyInfoToYoutube } from "./to-youtube/SpotifyToYoutube";

export const convertInfo = (song: Song) => {
    if (getSongSource(song.url).src === "spotify") {
        return convertSpotifyInfoToYoutube(song);
    }
    /*Add support for soundcloud*/
    return song;
};

export const __FOR__TESTING__ = {
    convertInfo,
};

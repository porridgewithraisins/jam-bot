import { Song } from "../common/Types";
import { getSongSource } from "./Fetcher";
import { convertSpotifyInfoToYoutube } from "./to-youtube/SpotifyToYoutube";

export const convertInfoToYoutube = (song: Song) => {
    if (getSongSource(song.url).src === "spotify") {
        return convertSpotifyInfoToYoutube(song);
    }
    /*Add support for soundcloud*/
    return song;
};

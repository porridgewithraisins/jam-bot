import * as ytdlCoreDiscord from "ytdl-core-discord";
import { configObj } from "../common/Config";
import { fetchFromSpotify } from "./fetchers/Spotify.Fetcher";
import { fetchFromYoutube } from "./fetchers/Youtube.Fetcher";
import { searchOne } from "./Searcher";

export type SongSource = {
    src:
        | "youtube"
        | "youtube-playlist"
        | "youtube-search"
        | "spotify"
        | "spotify-playlist"
        | "spotify-album";
    meta?: string;
};

export const getSongSource = (url: string): SongSource => {
    if (ytdlCoreDiscord.validateURL(url)) return { src: "youtube" };
    if (/[&?]list=([a-z0-9_]+)/i.exec(url)) return { src: "youtube-playlist" };
    const [, src, id] =
        url.match(
            /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|track|playlist)\/|\?uri=spotify:track:)((\w|-){22})/
        ) ||
        url.match(
            /spotify:(?:(album|track|playlist):|\?uri=spotify:track:)((\w|-){22})/
        ) ||
        [];
    return src && id
        ? {
              src:
                  src === "playlist"
                      ? "spotify-playlist"
                      : src === "track"
                      ? "spotify"
                      : "spotify-album",
              meta: id,
          }
        : { src: "youtube-search" };
};

const delegator = (arg: string) => {
    switch (getSongSource(arg).src) {
        case "youtube":
        case "youtube-playlist":
            return () => fetchFromYoutube(arg);
        case "spotify":
        case "spotify-playlist":
        case "spotify-album":
            if (configObj.spotify) {
                return () => fetchFromSpotify(arg);
            }
        case "youtube-search":
            return () => searchOne(arg);
    }
};

export const fetchSong = (arg: string) => delegator(arg)();

export const __FOR__TESTING__ = {
    getSongSource,
    delegator,
};

import { fetchFromYoutube } from "./fetchers/Youtube";
import { fetchFromSpotify } from "./fetchers/Spotify";
import { searchOne } from "./Searcher";
import * as ytdlCoreDiscord from "ytdl-core-discord";
import { SongSource } from "../common/Types";
import { configObj } from "../config/Config";

export const getSongSource = (url: string): SongSource => {
    if (ytdlCoreDiscord.validateURL(url)) return { src: "youtube" };
    if (/[&?]list=([a-z0-9_]+)/i.exec(url)) return { src: "youtube-playlist" };
    const [,src, id] =
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

export const fetch = (arg: string) => delegator(arg)();

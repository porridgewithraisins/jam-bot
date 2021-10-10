import * as ytdlCoreDiscord from "ytdl-core-discord";
import * as ytpl from "ytpl";
import * as Utils from "../../common/Utils";
import { Song } from "../../models/Song.Model";
import { getSongSource } from "../Fetcher";

const getPlaylist = async (url: string, limit = 100): Promise<Song[]> => {
    const filterItems = ({
        title,
        url,
        duration,
        bestThumbnail: { url: thumbURL },
        author: { name },
        isLive,
    }: ytpl.Item): Song => ({
        title,
        url,
        duration: duration as string,
        thumbnail: thumbURL as string,
        artist: name,
        isLive,
    });
    try {
        const result = await ytpl.default(url, { limit });
        return result.items.map(filterItems);
    } catch {
        return [];
    }
};

const getSong = async (url: string): Promise<Song[]> => {
    try {
        const result = await ytdlCoreDiscord.getInfo(url);
        const details = result.videoDetails;
        return [
            {
                title: details.title,
                url: details.video_url,
                duration: Utils.millisecToDuration(
                    parseInt(details.lengthSeconds) * 1000
                ),
                thumbnail: details.thumbnails[0].url,
                artist: details.author.name,
                isLive: details.isLiveContent,
            },
        ];
    } catch {
        return [];
    }
};

const delegator = (arg: string): (() => Promise<Song[]>) => {
    const { src } = getSongSource(arg);
    if (src === "youtube") return () => getSong(arg);
    if (src === "youtube-playlist") return () => getPlaylist(arg);
    else throw new Error("Bad url passed to youtube fetcher");
};

export const fetchFromYoutube = (arg: string) => delegator(arg)();

export const __FOR__TESTING__ = { fetchFromYoutube };

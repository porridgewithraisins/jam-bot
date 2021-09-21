import * as ytpl from "ytpl";
import * as Types from "../../common/Types";
import * as ytdlCoreDiscord from "ytdl-core-discord";
import * as Utils from "../../common/Utils";

const getPlaylist = async (
    url: string,
    limit = Infinity
): Promise<Types.Song[]> => {
    const filterItems = ({
        title,
        url,
        duration,
        bestThumbnail: { url: thumbURL },
        author: { name },
    }: ytpl.Item): Types.Song => ({
        title,
        url,
        duration: duration as string,
        thumbnail: thumbURL as string,
        artist: name,
    });
    return (await ytpl.default(url, { limit })).items.map(filterItems);
};

const getSong = async (url: string): Promise<Types.Song[]> => {
    const details = (await ytdlCoreDiscord.getInfo(url)).videoDetails;
    return [
        {
            title: details.title,
            url: details.video_url,
            duration: Utils.millisecToDuration(
                parseInt(details.lengthSeconds) * 1000
            ),
            thumbnail: details.thumbnails[0].url,
            artist: details.author.name,
        },
    ];
};

const delegator = (arg: string): (() => Promise<Types.Song[]>) => {
    const source = Utils.getSource(arg);
    if (source === "youtube") return () => getSong(arg);
    if (source === "youtube-playlist") return () => getPlaylist(arg);
    else throw new Error("Bad url passed to youtube fetcher");
};

export const controller = (arg: string) => delegator(arg)();

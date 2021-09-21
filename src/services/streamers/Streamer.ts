import * as Utils from "../../common/Utils";
import * as ytdl from "ytdl-core-discord";

const delegator = (url: string) => {
    if (Utils.getSource(url) !== "youtube") {
        //should never happen
        throw new Error("bad URL passed to streamer");
    }
    return () => ytdl.default(Utils.prependHttp(url), { filter: "audioonly" });
};

export const controller = (url: string) => delegator(url)();

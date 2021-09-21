import * as Utils from "../../common/Utils";
import * as Youtube from "./Youtube";
import * as Spotify from "./Spotify";
import * as Search from "../searchers/Searcher";
const delegator = (arg: string) => {
    switch (Utils.getSource(arg)) {
        case "youtube":
        case "youtube-playlist":
            return () => Youtube.controller(arg);
        case "spotify":
        case "spotify-playlist":
        default:
            return () => Search.searchOne(arg);
    }
};

export const controller = (arg: string) => delegator(arg)();

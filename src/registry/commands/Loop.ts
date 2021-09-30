import * as Utils from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.model";

export const toggleLoop = async (ctx: MusicPlayer) => {
    ctx.shouldLoopSong = !ctx.shouldLoopSong;

    if (ctx.nowPlaying) {
        if (ctx.shouldLoopSong)
            ctx.messenger.send(
                `Looping ${Utils.mdHyperlinkSong(ctx.nowPlaying)}`
            );
        else
            ctx.messenger.send(
                `Cancelled loop on ${Utils.mdHyperlinkSong(ctx.nowPlaying)}`
            );
    } else {
        ctx.messenger.send("There is nothing playing");
    }
};

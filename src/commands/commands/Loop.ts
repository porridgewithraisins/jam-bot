import { mdHyperlinkSong } from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer";

export const toggleLoop = async (ctx: MusicPlayer) => {
    ctx.shouldLoopSong = !ctx.shouldLoopSong;

    if (ctx.nowPlaying) {
        if (ctx.shouldLoopSong)
            ctx.messenger.send(`Looping ${mdHyperlinkSong(ctx.nowPlaying)}`);
        else
            ctx.messenger.send(
                `Cancelled loop on ${mdHyperlinkSong(ctx.nowPlaying)}`
            );
    } else {
        ctx.messenger.send("There is nothing playing");
    }
};

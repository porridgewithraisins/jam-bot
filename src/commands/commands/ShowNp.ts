import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Views from "../../views/ViewExporter";

export const showNp = async (ctx: MusicPlayer) => {
    if (ctx.nowPlaying) {
        ctx.messenger.send(Views.nowPlayingView(ctx.nowPlaying));
    } else {
        ctx.messenger.send("There is nothing playing right now");
    }
};

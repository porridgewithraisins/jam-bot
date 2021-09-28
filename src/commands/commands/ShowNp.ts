import { nowPlayingView } from "../../services/Views";
import { MusicPlayer } from "../../models/MusicPlayer";

export const showNp = async (ctx: MusicPlayer) => {
    if (ctx.nowPlaying) {
        ctx.messenger.send(nowPlayingView(ctx.nowPlaying));
    } else {
        ctx.messenger.send("There is nothing playing right now");
    }
};

import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const replay = async (ctx: MusicPlayer) => {
    if (!ctx.lastPlayed) {
        ctx.messenger.send("Could not find last played song");
        return;
    }

    ctx.songs.unshift(ctx.lastPlayed);
    ctx.shouldLoopSong = false;
    if (ctx.nowPlaying) ctx.songs.splice(1, 0, ctx.nowPlaying);
    ctx.messenger.send("Playing last played song...");
    ctx.player.stop();
};

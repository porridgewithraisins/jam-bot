import { MusicPlayer } from "../../models/MusicPlayer";

export const restart = async (ctx: MusicPlayer) => {
    if (!ctx.nowPlaying) return;
    ctx.songs.unshift(ctx.nowPlaying);
    ctx.player.stop(true);
    ctx.messenger.send("Restarting the current song...");
};

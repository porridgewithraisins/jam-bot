import { MusicPlayer } from "../../models/MusicPlayer.model";

export const clearQueue = async (ctx: MusicPlayer) => {
    ctx.songs = [];
    ctx.messenger.send("Cleared queue!");
};

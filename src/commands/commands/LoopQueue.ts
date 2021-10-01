import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const toggleLoopQueue = async (ctx: MusicPlayer) => {
    ctx.shouldLoopQueue = !ctx.shouldLoopQueue;
    ctx.messenger.send(
        ctx.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
    );
};

import { MusicPlayer } from "../../models/MusicPlayer.model";

export const toggleLoopQueue = async (ctx: MusicPlayer) => {
    ctx.shouldLoopQueue = !ctx.shouldLoopQueue;
    ctx.messenger.send(
        ctx.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
    );
};

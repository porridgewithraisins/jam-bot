import { MusicPlayer } from "../../models/MusicPlayer";

export const toggleLoopQueue = async (ctx: MusicPlayer) => {
    ctx.shouldLoopQueue = !ctx.shouldLoopQueue;
    ctx.messenger.send(
        ctx.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
    );
};

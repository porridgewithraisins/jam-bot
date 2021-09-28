import { MusicPlayer } from "../../models/MusicPlayer";
import { skip } from "./Skip";

export const voteSkip = async (ctx: MusicPlayer) => {
    ctx.votesForSkip++;
    const total = ctx.guild.me!.voice.channel?.members?.size ?? 1;
    const fellows = total - 1;
    if (ctx.votesForSkip > fellows / 2) {
        skip(ctx);
        ctx.votesForSkip = 0;
    }
};

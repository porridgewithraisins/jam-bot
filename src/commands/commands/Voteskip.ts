import * as Utils from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Commands from "../CommandExporter";

export const voteSkip = async (ctx: MusicPlayer) => {
    ctx.votesForSkip++;
    const total = ctx.guild.me?.voice.channel?.members?.size ?? 1;
    const fellows = total - 1;
    const text = voteSkipText(ctx.votesForSkip, fellows);
    ctx.voteSkipMsg
        ? ctx.voteSkipMsg
              .edit(text)
              .then((msg) => (ctx.voteSkipMsg = msg))
              .catch((noop) => noop)
        : ctx.messenger
              .send(text)
              ?.then((msg) => (ctx.voteSkipMsg = msg))
              .catch((noop) => noop);

    if (Utils.majority(ctx.votesForSkip, fellows)) {
        Commands.skip(ctx);
        [ctx.votesForSkip, ctx.voteSkipMsg] = [0, undefined];
    }
};

const voteSkipText = (votes: number, total: number) =>
    `Voteskip ${votes}/${total}`;

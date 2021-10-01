import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Commands from "../CommandExporter";

export const moveRange = async (ctx: MusicPlayer, arg: string) => {
    const [fromRange, toIndex] = arg.split(" ");
    let [from, to] = fromRange.split("-").map((x) => parseInt(x) - 1);
    let toIdx = parseInt(toIndex) - 1;
    if (isNaN(from) || isNaN(to)) {
        Commands.invalid(ctx);
        return;
    }
    if (from < 0 || from >= ctx.songs.length) {
        ctx.messenger.send(`There is nothing at position ${from + 1}`);
        return;
    }
    if (to <= from) {
        ctx.messenger.send("No range selected");
        return;
    }

    if (to >= ctx.songs.length) to = ctx.songs.length;

    if (isNaN(toIdx)) {
        Commands.invalid(ctx);
        return;
    }
    const spliced = ctx.songs.splice(from, to - from + 1);
    ctx.songs.splice(toIdx, 0, ...spliced);
    ctx.messenger.send(
        `Moving from position ${from + 1} to position ${to + 1}`
    );
};

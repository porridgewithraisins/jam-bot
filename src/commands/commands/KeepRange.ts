import * as Commands from "../Commands";
import { MusicPlayer } from "../../models/MusicPlayer";

export const keepRange = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    const toKeep = new Set<number>();
    for (const range of arg.split(" ")) {
        let [from, to] = range.split("-").map((x) => parseInt(x) - 1);
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
        for (let i = from; i <= to; i++) toKeep.add(i);
    }

    ctx.songs = ctx.songs.filter((_elem, idx) => toKeep.has(idx));
    ctx.messenger.send(`Kept ${toKeep.size} songs. Discarded the rest`);
};

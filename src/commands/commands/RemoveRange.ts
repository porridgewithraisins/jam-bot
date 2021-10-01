import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Commands from "../CommandExporter";

export const removeRange = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    const toRemove = new Set<number>();
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
            ctx.messenger.send("Invalid range");
            return;
        }
        if (to >= ctx.songs.length) to = ctx.songs.length - 1;
        for (let i = from; i <= to; i++) toRemove.add(i);
    }
    ctx.songs = ctx.songs.filter((_elem, idx) => !toRemove.has(idx));

    ctx.messenger.send(`Removed ${toRemove.size} songs from the queue`);
};

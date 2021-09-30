import { mdHyperlinkSong } from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.model";
import * as Commands from "../CommandExporter";

export const keep = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    const toKeep: number[] = [];
    for (const pos of arg.split(" ")) {
        const idx = parseInt(pos) - 1;
        if (isNaN(idx)) {
            Commands.invalid(ctx);
            return;
        }
        if (idx >= ctx.songs.length || idx < 0) {
            ctx.messenger.send(`There is nothing at position ${idx + 1}`);
        } else {
            toKeep.push(idx);
            ctx.messenger.send(`Keeping ${mdHyperlinkSong(ctx.songs[idx])}`);
        }
    }
    ctx.songs = ctx.songs.filter((_elem, idx) => toKeep.includes(idx));
};

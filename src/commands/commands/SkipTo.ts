import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Commands from "../CommandExporter";

export const skipTo = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) return;
    const idx = parseInt(arg) - 1;
    if (isNaN(idx)) {
        Commands.invalid(ctx);
        return;
    }

    ctx.songs.splice(0, idx);
    ctx.shouldLoopSong = false;
    Commands.skip(ctx);
};

import * as Commands from "../CommandExporter";
import { MusicPlayer } from "../../models/MusicPlayer";

export const skipTo = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) return;
    const idx = parseInt(arg) - 1;
    if (isNaN(idx)) {
        Commands.invalid(ctx);
        return;
    }

    ctx.songs.splice(0, idx);

    Commands.skip(ctx);
};

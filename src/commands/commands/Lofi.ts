import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Commands from "../CommandExporter";

export const lofi = async (ctx: MusicPlayer, arg: string) => {
    const which = parseInt(arg);
    if (which === 1)
        Commands.play(ctx, "https://www.youtube.com/watch?v=5qap5aO4i9A");
    else if (which === 2)
        Commands.play(ctx, "https://www.youtube.com/watch?v=DWcJFNfaw9c");
    else Commands.invalid(ctx);
};

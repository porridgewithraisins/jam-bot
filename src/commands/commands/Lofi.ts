import * as Commands from "../Commands";
import { MusicPlayer } from "../../models/MusicPlayer";
import { play } from "./Play";

export const lofi = async (ctx: MusicPlayer, arg: string) => {
    const which = parseInt(arg);
    if (which === 1) play(ctx, "https://www.youtube.com/watch?v=5qap5aO4i9A");
    else if (which === 2)
        play(ctx, "https://www.youtube.com/watch?v=DWcJFNfaw9c");
    else Commands.invalid(ctx);
};

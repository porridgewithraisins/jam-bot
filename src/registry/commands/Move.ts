import * as Utils from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.model";
import * as Commands from "../CommandExporter";

export const move = async (ctx: MusicPlayer, arg: string) => {
    let [from, to] = arg.split(" ").map((x) => parseInt(x) - 1);
    if (isNaN(from) || isNaN(to)) {
        Commands.invalid(ctx);
        return;
    }
    if (from < 0 || from >= ctx.songs.length) {
        ctx.messenger.send(`There is nothing at position ${from + 1}`);
        return;
    }
    if (to < 0) {
        ctx.messenger.send(`Cannot move to ${to + 1}`);
        return;
    }
    if (to >= ctx.songs.length) to = ctx.songs.length - 1;

    const song = ctx.songs.splice(from, 1)[0];
    ctx.songs.splice(to, 0, song);
    ctx.messenger.send(
        `Moving ${Utils.mdHyperlinkSong(song)} to position ${to + 1}`
    );
};

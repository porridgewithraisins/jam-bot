import * as Commands from "../CommandExporter";
import { MusicPlayer } from "../../models/MusicPlayer";
import * as Stash from "../../services/Stash";
import { Song } from "../../models/Song";

export const stashPush = async (ctx: MusicPlayer, arg: string) => {
    const [range, name] = arg.split(" ");
    if (!range || !name) {
        Commands.invalid(ctx);
        return;
    }
    let toBeStored: Song[] = [];
    if (range === "*") {
        toBeStored = ctx.songs.slice();
    } else {
        const [from, to] = range.split("-").map((x) => parseInt(x));
        if (isNaN(from) || isNaN(to)) {
            Commands.invalid(ctx);
            return;
        }
        toBeStored = ctx.songs.slice(from - 1, to);
    }
    if (toBeStored.length) {
        Stash.push(ctx.guild.id, name, toBeStored);
        ctx.messenger.send(`Stored ${toBeStored.length} songs as ${name}`);
    } else {
        ctx.messenger.send("Cannot store empty queue");
    }
};

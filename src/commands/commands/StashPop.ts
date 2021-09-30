import * as Commands from "../CommandExporter";
import { MusicPlayer } from "../../models/MusicPlayer";
import * as Stash from "../../services/Stash";
import { initPlayer } from "../../services/AudioPlayer";
import { Song } from "../../models/Song";

export const stashPop = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    const stored = (await Stash.pop(ctx.guild.id, arg)) as Song[];
    if (stored) {
        ctx.songs.push(...stored);
        if (!ctx.started) {
            initPlayer(ctx);
        }
        ctx.messenger.send(
            `Appended ${stored.length} songs from ${arg} to the end of queue`
        );
    } else {
        ctx.messenger.send(`Could not find a list with name ${arg}`);
    }
};

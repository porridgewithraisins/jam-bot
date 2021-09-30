import { MusicPlayer } from "../../models/MusicPlayer.model";
import { Song } from "../../models/Song";
import { initPlayer } from "../../services/AudioPlayer";
import * as Stash from "../../services/Stash";
import * as Commands from "../CommandExporter";

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
        ctx.messenger.send(`Could not find a list named ${arg}`);
    }
};
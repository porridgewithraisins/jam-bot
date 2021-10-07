import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { Song } from "../../models/Song.Model";
import { kickstartPlayer } from "../../services/AudioPlayer";
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
        if (ctx.shouldKickStart) {
            kickstartPlayer(ctx);
        }
        ctx.messenger.send(
            `Appended ${stored.length} songs from ${arg} to the end of queue`
        );
    } else {
        ctx.messenger.send(`Could not find a list named ${arg}`);
    }
};

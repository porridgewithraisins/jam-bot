import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Stash from "../../services/Stash";
import * as Commands from "../CommandExporter";

export const stashDrop = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    Stash.drop(ctx.guild.id, arg === "*" ? undefined : arg);
    if (arg == "*") ctx.messenger.send("Dropped all queues");
    else ctx.messenger.send(`Dropped queue ${arg}`);
};

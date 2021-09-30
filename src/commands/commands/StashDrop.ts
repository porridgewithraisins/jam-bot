import * as Commands from "../CommandExporter";
import { MusicPlayer } from "../../models/MusicPlayer";
import * as Stash from "../../services/Stash";

export const stashDrop = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    Stash.drop(ctx.guild.id, arg === "*" ? undefined : arg);
    if (arg == "*") ctx.messenger.send("Dropped all queues");
    else ctx.messenger.send(`Dropped queue ${arg}`);
};

import * as Utils from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { Song } from "../../models/Song.Model";
import * as Stash from "../../services/Stash";
import * as Commands from "../CommandExporter";

export const stashView = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        Commands.invalid(ctx);
        return;
    }
    if (arg === "*") {
        const storedLists = (await Stash.view(ctx.guild.id)) as Record<
            string,
            Song[]
        >;
        if (!storedLists || !Object.keys(storedLists).length) {
            ctx.messenger.send("There are no stashed queues");
            return;
        }
        for (const name in storedLists) {
            showStashItem(ctx, name, storedLists[name]);
        }
    } else {
        const storedList = (await Stash.view(ctx.guild.id, arg)) as Song[];
        if (storedList) {
            showStashItem(ctx, arg, storedList);
            return;
        } else {
            ctx.messenger.send(`Could not find a list named ${arg}`);
            return;
        }
    }
};
const showStashItem = async (ctx: MusicPlayer, name: string, list: Song[]) => {
    const revealLimit = 10;
    const nameText = `**${name}**`;
    const listText = list
        .slice(0, revealLimit)
        .map((song, idx) => `**${idx + 1}.** ${Utils.mdHyperlinkSong(song)}`)
        .join("\n");
    const remaining = Utils.clampAtZero(list.length - revealLimit);
    const footerText = remaining > 0 ? `...and ${remaining} more` : "";
    ctx.messenger.send([nameText, listText, footerText].join("\n"));
};
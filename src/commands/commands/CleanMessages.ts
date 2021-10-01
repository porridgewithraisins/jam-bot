import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { musicCommandRecognizer } from "../../musicplayer/MusicPlayer.Controller";

export const cleanMessages = async (ctx: MusicPlayer) => {
    await ctx.messenger.send("Cleaning messages...");
    ctx.messenger.clean((content) => musicCommandRecognizer(content));
};

import { musicCommandRecognizer } from "../../controllers/MusicPlayer.controller";
import { MusicPlayer } from "../../models/MusicPlayer.model";

export const cleanMessages = async (ctx: MusicPlayer) => {
    await ctx.messenger.send("Cleaning messages...");
    ctx.messenger.clean((content) => musicCommandRecognizer(content));
};

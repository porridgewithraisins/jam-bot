import { musicCommandRecognizer } from "../../controllers/MusicPlayer";
import { MusicPlayer } from "../../models/MusicPlayer";

export const cleanMessages = async (ctx: MusicPlayer) => {
    await ctx.messenger.send("Cleaning messages...");
    ctx.messenger.clean((content: string) =>
        musicCommandRecognizer(ctx, content)
    );
};

import { MusicPlayer } from "../../models/MusicPlayer.model";

export const skip = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Skipped!");
    ctx.player.stop(true);
};

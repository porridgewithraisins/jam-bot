import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const skip = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Skipped!");
    ctx.player.stop(true);
};

import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const unShutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = false;
};

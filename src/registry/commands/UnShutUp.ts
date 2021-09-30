import { MusicPlayer } from "../../models/MusicPlayer.model";

export const unShutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = false;
};

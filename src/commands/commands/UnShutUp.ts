import { MusicPlayer } from "../../models/MusicPlayer";

export const unShutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = false;
};

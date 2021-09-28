import { MusicPlayer } from "../../models/MusicPlayer";

export const shutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = true;
};

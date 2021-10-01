import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const shutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = true;
};

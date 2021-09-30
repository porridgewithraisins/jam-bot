import { MusicPlayer } from "../../models/MusicPlayer.model";

export const shutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.shouldBeSilent = true;
};

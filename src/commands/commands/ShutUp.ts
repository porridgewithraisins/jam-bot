import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const shutUp = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Ok, I won't talk anymore");
    ctx.messenger.shouldBeSilent = true;
};

import { fischerYatesShuffle } from "../../common/Utils";
import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const shuffle = async (ctx: MusicPlayer) => {
    fischerYatesShuffle(ctx.songs);
    ctx.messenger.send("Shuffled!");
};

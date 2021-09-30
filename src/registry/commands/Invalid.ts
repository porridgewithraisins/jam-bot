import { MusicPlayer } from "../../models/MusicPlayer.model";

export const invalid = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Invalid Command");
};

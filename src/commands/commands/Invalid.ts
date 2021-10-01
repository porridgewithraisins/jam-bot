import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const invalid = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Invalid Command");
};

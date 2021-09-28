import { MusicPlayer } from "../../models/MusicPlayer";

export const invalid = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Invalid Command");
};

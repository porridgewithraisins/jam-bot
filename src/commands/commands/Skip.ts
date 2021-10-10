import { AudioPlayerStatus } from "@discordjs/voice";
import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const skip = async (ctx: MusicPlayer) => {
    ctx.messenger.send("Skipped!");
    ctx.player.state.status === AudioPlayerStatus.Paused
        ? ctx.player.unpause()
        : ctx.player.stop();
};

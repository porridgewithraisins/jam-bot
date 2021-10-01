import { AudioPlayerStatus } from "@discordjs/voice";
import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const pause = async (ctx: MusicPlayer) => {
    if (ctx.player.state.status === AudioPlayerStatus.Playing) {
        ctx.player.pause();
        ctx.nowPlaying?.elapsedTimer.stop();
        ctx.messenger.send("Paused");
    } else {
        ctx.messenger.send("There is nothing playing");
    }
};

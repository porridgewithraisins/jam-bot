import { AudioPlayerStatus } from "@discordjs/voice";
import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { Song } from "../../models/Song.Model";
import { initPlayer } from "../../services/AudioPlayer";
import { fetchSong } from "../../services/Fetcher";
import { songView } from "../../services/ViewExporter";

export const play = async (ctx: MusicPlayer, arg: string) => {
    if (!arg) {
        resume(ctx);
        return;
    }
    let newSongs: Song[] = [];
    if (ctx.isInSearchFlow) {
        for (const pos of arg.split(" ")) {
            const [possiblyFrom, possiblyTo] = pos
                .split("-")
                .map((x) => parseInt(x) - 1);
            if (!isNaN(possiblyFrom)) {
                if (possiblyTo && !isNaN(possiblyTo)) {
                    newSongs.push(
                        ...ctx.searchResult.slice(possiblyFrom, possiblyTo + 1)
                    );
                } else {
                    newSongs.push(ctx.searchResult[possiblyFrom]);
                }
            }
        }
        [ctx.isInSearchFlow, ctx.searchResult] = [false, []];
    }

    if (!newSongs.length) {
        for (let _arg of arg.split(",")) {
            _arg = _arg.trim();
            ctx.messenger.sendTyping();
            if (_arg) newSongs.push(...(await fetchSong(_arg)));
        }
        if (!newSongs.length) {
            ctx.messenger.send("Could not find song");
            return;
        }
    }
    ctx.songs.push(...newSongs);
    if (ctx.player.state.status !== AudioPlayerStatus.Idle) {
        if (newSongs.length > 1)
            ctx.messenger.send(`Added ${newSongs.length} songs to the queue`);
        else ctx.messenger.send(songView(newSongs[0]));
    }

    if (!ctx.started) initPlayer(ctx);
};

const resume = async (ctx: MusicPlayer) => {
    if (isPlayerPaused(ctx)) {
        ctx.player.unpause();
        ctx.nowPlaying?.elapsedTimer.start();
        ctx.messenger.send("Resuming...");
    } else {
        ctx.messenger.send("No song specified");
    }
};

const isPlayerPaused = (ctx: MusicPlayer) =>
    [AudioPlayerStatus.AutoPaused, AudioPlayerStatus.Paused].includes(
        ctx.player.state.status
    );

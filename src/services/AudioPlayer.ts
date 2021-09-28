import * as Commands from "../commands/Commands";
import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { Song } from "../common/Types";
import { MusicPlayer } from "../models/MusicPlayer";
import { streamSong } from "./Streamer";
import { ElapsedTimer } from "./Timer";
import { convertInfo } from "./ToYoutube";

export const initPlayer = async (ctx: MusicPlayer) => {
    if (!ctx.started) ctx.started = true;

    const onPlayerIdle = async () => {
        const next = await nextSong(ctx);
        if (next) {
            playSong(ctx, next);
            ctx.votesForSkip = 0;
        } else Commands.quit(ctx);
    };

    onPlayerIdle();

    ctx.player.on(AudioPlayerStatus.Idle, () => onPlayerIdle());

    ctx.player.on("error", (error) => {
        console.log(error);
        ctx.messenger.send("Error playing audio. Skipping");
        Commands.skip(ctx);
    });
};

const nextSong = async (ctx: MusicPlayer) => {
    if (ctx.shouldLoopSong) return ctx.nowPlaying;

    const next = ctx.songs.shift();
    if (!next) return undefined;

    if (ctx.shouldLoopQueue) ctx.songs.push(next);

    return next;
};

const playSong = async (ctx: MusicPlayer, song: Song) => {
    const converted = await convertInfo(song);
    if (!converted) {
        ctx.messenger.send("Could not play ctx song");
        Commands.skip(ctx);
        return;
    }

    song = converted;
    const audioResource = createAudioResource(await streamSong(song));

    try {
        ctx.player.play(audioResource);
    } catch (e) {}
    ctx.nowPlaying = {
        ...song,
        elapsedTimer: new ElapsedTimer(song.duration),
    };
    Commands.showNp(ctx);
};

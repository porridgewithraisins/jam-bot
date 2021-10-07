import { AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import * as Commands from "../commands/CommandExporter";
import { configObj } from "../common/Config";
import { MusicPlayer } from "../models/MusicPlayer.Model";
import { Song } from "../models/Song.Model";
import { streamSong } from "./Streamer";
import { ElapsedTimer } from "./Timer";
import { convertInfo } from "./ToYoutube";

const onPlayerIdle = async (ctx: MusicPlayer) => {
    ctx.lastPlayed = ctx.nowPlaying;
    const next = await nextSong(ctx);
    if (next) {
        playSong(ctx, next);
        ctx.votesForSkip = 0;
    } else {
        ctx.idleTimer = setTimeout(() => {
            Commands.quit(ctx);
        }, configObj.idleTimeout * 1000);
        ctx.shouldKickStart = true;
    }
};

export const kickstartPlayer = async (ctx: MusicPlayer) => {
    if (ctx.shouldKickStart) {
        ctx.shouldKickStart = false;
        onPlayerIdle(ctx);
    }

    ctx.player.on(AudioPlayerStatus.Idle, () => onPlayerIdle(ctx));

    ctx.player.on("error", (error) => {
        console.log("Error fetching stream!", error.message);
        ctx.messenger.send("Error fetching audio. Skipping");
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
        ctx.messenger.send("Could not play song");
        Commands.skip(ctx);
        return;
    }

    song = converted;

    if (song.isLive) {
        ctx.messenger.send(
            `Live streams may stop due to buffering issues, at which juncture
            you can use the \`replay\` command to continue it.`,
            undefined,
            { disappearAfter: 10_000 }
        );
    }

    const audioResource = createAudioResource(await streamSong(song), {
        silencePaddingFrames: 20,
    });

    try {
        ctx.player.play(audioResource);
    } catch (e) {}
    ctx.nowPlaying = {
        ...song,
        elapsedTimer: new ElapsedTimer(song.duration),
    };
    Commands.showNp(ctx);
};

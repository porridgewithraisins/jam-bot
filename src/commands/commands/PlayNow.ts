import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { Song } from "../../models/Song.Model";
import { fetchSong } from "../../services/Fetcher";

export const playNow = async (ctx: MusicPlayer, arg: string) => {
    let newSongs: Song[] = [];
    for (const _arg of arg.split(",")) {
        newSongs.push(...(await fetchSong(_arg.trim())));
    }
    if (newSongs.length) {
        ctx.songs.unshift(...newSongs);
        ctx.shouldLoopSong = false;
        ctx.player.stop();
    } else {
        ctx.messenger.send("Could not find song");
    }
};

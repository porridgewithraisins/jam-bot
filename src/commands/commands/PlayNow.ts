import { fetchSong } from "../../services/Fetcher";
import { MusicPlayer } from "../../models/MusicPlayer";
import { Song } from "../../models/Song";

export const playNow = async (ctx: MusicPlayer, arg: string) => {
    let newSongs: Song[] = [];
    for (const _arg of arg.split(",")) {
        newSongs.push(...(await fetchSong(_arg.trim())));
    }
    if (newSongs.length) {
        ctx.songs.unshift(...newSongs);
        ctx.player.stop();
    } else {
        ctx.messenger.send("Could not find song");
    }
};

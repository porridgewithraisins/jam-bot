import * as Utils from "../common/Utils";
import * as ytdl from "ytdl-core-discord";
import { Song } from "../common/Types";

export const streamSong = async (song: Song) =>
    ytdl.default(Utils.prependHttp(song.url), {
        filter: "audioonly",
    });

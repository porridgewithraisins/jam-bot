import * as ytdl from "ytdl-core-discord";
import * as Utils from "../common/Utils";
import { Song } from "../models/Song";

export const streamSong = async (song: Song) =>
    ytdl.default(Utils.prependHttp(song.url), {
        filter: "audioonly",
    });

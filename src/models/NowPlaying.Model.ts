import { ElapsedTimer } from "../services/Timer";
import { Song } from "./Song.Model";

export interface NowPlaying extends Song {
    elapsedTimer: ElapsedTimer;
}

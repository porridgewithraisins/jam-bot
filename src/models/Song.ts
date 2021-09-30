import { ElapsedTimer } from "../services/Timer";

export interface Song {
    title: string;
    url: string;
    duration: string;
    thumbnail?: string;
    artist?: string;
}

export interface NowPlaying extends Song {
    elapsedTimer: ElapsedTimer;
}

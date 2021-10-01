import { MusicPlayer } from "../models/MusicPlayer.Model";

export interface Command {
    triggers: string[];
    handler: (ctx: MusicPlayer, arg: string) => Promise<void>;
}

export type RecognizedCommands = typeof MusicPlayerCommands[number];

export const MusicPlayerCommands = [
    "search",
    "play",
    "lofi",
    "restart",
    "pause",
    "nowplaying",
    "skip",
    "voteskip",
    "queue",
    "move",
    "moverange",
    "remove",
    "removerange",
    "keep",
    "keeprange",
    "clear",
    "skipto",
    "playnow",
    "loop",
    "loopq",
    "shutup",
    "speakagain",
    "clean",
    "quit",
    "stash pop",
    "stash push",
    "stash drop",
    "stash view",
] as const;

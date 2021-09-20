import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    StreamType,
} from "@discordjs/voice";
import { MessageEmbed, TextBasedChannels } from "discord.js";
import { getSongs, getStream, searchYt } from "./Songs";
import { prefixify, mdHyperlinkSong, getArg, getCmd } from "./Utils";
import {
    Song,
    MusicPlayerCommandMap,
    MusicPlayerArgs,
    NowPlaying,
} from "./Types";
import * as Stash from "./Stash";
import { ElapsedTimer } from "./ElapsedTimer";
import { nowPlayingView, songView } from "./Views";
import * as Messaging from "./Messaging";
export { MusicPlayer };

class MusicPlayer {
    private readonly player: AudioPlayer = createAudioPlayer();
    private readonly guildId: string;
    private readonly textChannel: TextBasedChannels;

    //State variables
    private started = false;
    private songs: Song[] = [];
    private nowPlaying: NowPlaying | undefined;
    private silence = false;
    private isInSearchFlow = false;
    private searchResult: Song[] = [];
    private shouldLoopSong = false;
    private shouldLoopQueue = false;
    private stashingAllowed = false;
    //State variables

    //State variables
    private readonly onQuitCallback: () => any;

    public readonly commands: MusicPlayerCommandMap = {
        help: {
            description: "Show this help message",
            triggers: [prefixify("h"), prefixify("help")],
            handler: (_arg) => this.help(),
        },
        search: {
            description:
                "Search for a song, and then choose a position in it, to play",
            triggers: [prefixify("search")],
            handler: (arg) => this.search(arg),
        },
        play: {
            description:
                "`play [song name/url]`. Don't specify any song, to resume a paused song",
            triggers: [prefixify("p"), prefixify("play")],
            handler: (arg) => this.play(arg),
        },
        pause: {
            description: "Pause the currently playing song.",
            triggers: [prefixify("pause"), prefixify("stop")],
            handler: (_arg) => this.pause(),
        },
        np: {
            description: "Show the currently playing song",
            triggers: [prefixify("np"), prefixify("nowplaying")],
            handler: (_arg) => this.showNp(),
        },
        skip: {
            description: "Skip the current song in the queue",
            triggers: [prefixify("s"), prefixify("skip")],
            handler: (_arg) => this.skip(),
        },
        queue: {
            description: "Show the current queue",
            triggers: [prefixify("q"), prefixify("queue")],
            handler: (_arg) => this.showQueue(),
        },
        move: {
            description:
                "Use `queue` to find out the position of the songs you want to move, and then use it like `move [from_position] [to_position]`",
            triggers: [prefixify("m"), prefixify("move")],
            handler: (arg) => this.move(arg),
        },
        moverange: {
            description:
                "Moves a range of the queue. For example, `moverange 1-3 7` moves songs at position 1,2,3 in the queue to position 7",
            triggers: [prefixify("mr"), prefixify("moverange")],
            handler: (arg) => this.moveRange(arg),
        },
        remove: {
            description:
                "Use `queue` to find the position(s) of the song(s) you want to remove, and call `remove [position1] [position2] ...`.",
            triggers: [prefixify("remove"), prefixify("r")],
            handler: (arg) => this.remove(arg),
        },
        removerange: {
            description:
                "Removes specified range(s) from the queue. For example, `removerange 1-3 4-6` removes songs at positions 1,2,3 and 4,5,6 in the queue",
            triggers: [prefixify("removerange"), prefixify("rr")],
            handler: (arg) => this.removeRange(arg),
        },
        keep: {
            description:
                "Opposite of remove. For example, `keep 1 3` keeps the specified positions 1,3,...in the queue, and discards the rest.",
            triggers: [prefixify("keep"), prefixify("k")],
            handler: (arg) => this.keep(arg),
        },
        keeprange: {
            description:
                "Opposite of removerange. Keeps specified range(s) from the queue. For example, `keeprange 1-3 4-6` keeps songs at positions 1,2,3 and 4,5,6 and discards the rest",
            triggers: [prefixify("keeprange"), prefixify("kr")],
            handler: (arg) => this.keepRange(arg),
        },
        clear: {
            description: "Clears the current queue",
            triggers: [prefixify("clear"), prefixify("clr")],
            handler: (_arg) => this.clear(),
        },
        skipto: {
            description:
                "skipto [index] skips to the position in the queue, forgetting all the songs before it",
            triggers: [prefixify("skipto")],
            handler: (arg) => this.skipto(arg),
        },
        playnow: {
            description:
                "playnow [song name/url] plays the song immediately on the top of the queue, the rest of the queue remains intact and will play next",
            triggers: [prefixify("playnow"), prefixify("pn")],
            handler: (arg) => this.playNow(arg),
        },
        loop: {
            description: "Toggles loop of the current song.",
            triggers: [prefixify("loop"), prefixify("l")],
            handler: (_arg) => this.toggleLoop(),
        },
        loopq: {
            description: "Toggles loop of the current queue.",
            triggers: [prefixify("loopq"), prefixify("lq")],
            handler: (_arg) => this.toggleLoopQueue(),
        },
        stash: {
            description: `Stash the current queue away for later use. Run ${prefixify(
                "stash help"
            )} for further details`,
            triggers: [prefixify("stash")],
            handler: (arg) => this.stashController(arg),
        },
        shutup: {
            description: "The music bot will stop sending text messages.",
            triggers: [prefixify("stfu"), prefixify("shutup")],
            handler: (_arg) => this.shutup(),
        },
        speakagain: {
            description: "The bot will resume sending messages",
            triggers: [prefixify("talk"), prefixify("speak")],
            handler: (_arg) => this.unshutup(),
        },
        quit: {
            description: "Quits the voice channel, and destroys the queue.",
            triggers: [prefixify("quit"), prefixify("dc")],
            handler: (_arg) => this.quit(),
        },
    };

    public readonly stashCommands: MusicPlayerCommandMap = {
        pop: {
            description:
                "Use `stash pop {name}` to append the saved list with name `{name}`. For e.g `stash pop myList`",
            triggers: ["pop", "get"],
            handler: (arg) => this.stashPop(arg),
        },
        push: {
            description:
                "Use `stash push * {name}` to store the whole of the current queue as `{name}`. For e.g `stash push * mylist`. Moreover, `stash push {from}-{to}\
                {name}` stores items from positions {from} to {to} as {name}",
            triggers: ["push", "add", "new"],
            handler: (arg) => this.stashPush(arg),
        },
        drop: {
            description:
                "Use `stash drop {name}` to delete the saved list with name `{name}`. For e.g, `stash drop myList`",
            triggers: ["drop", "del", "delete"],
            handler: (arg) => this.stashDrop(arg),
        },
        view: {
            description:
                "Use `stash view` to view all stashed playlists, and `stash view {name}` to view the playlist named `{name}`",
            triggers: ["view", "list"],
            handler: (arg) => this.stashView(arg),
        },
    };

    constructor({
        text,
        voice: { id, guildId },
        adapter,
        onQuitCallback,
    }: MusicPlayerArgs) {
        this.textChannel = text;
        this.guildId = guildId;
        this.onQuitCallback = onQuitCallback || (() => {});
        try {
            joinVoiceChannel({
                channelId: id,
                guildId: this.guildId,
                adapterCreator: adapter,
            }).subscribe(this.player);
        } catch (error) {
            console.error(error);
            Messaging.messenger(
                this.textChannel,
                "Error connecting to the voice channel!"
            );
        }
        this.stashingAllowed = Stash.init();
    }

    public async mainController(cmd: string, arg: string) {
        for (const command of Object.values(this.commands)) {
            if (command.triggers.includes(cmd)) {
                command.handler(arg);
                break;
            }
        }
    }

    private async messenger(arg: string | MessageEmbed | MessageEmbed[]) {
        if (!this.silence) Messaging.messenger(this.textChannel, arg);
    }

    private async help() {
        // TODO help view
    }

    private async search(arg: string) {
        this.textChannel.sendTyping();
        const result = await searchYt(arg);
        if (!result.length) {
            this.messenger(`No songs found matching your query ${arg}`);
            return;
        }
        this.startSearchFlow(result);
        // TODO paginated list view
    }

    private startSearchFlow(searchResult: Song[]) {
        [this.isInSearchFlow, this.searchResult] = [true, searchResult];
    }

    private endSearchFlow() {
        [this.isInSearchFlow, this.searchResult] = [false, []];
    }

    private async play(arg: string) {
        if (!arg) {
            this.resume();
            return;
        }

        let newSongs: Song[] = [];
        if (this.isInSearchFlow) {
            for (const pos of arg.split(" ")) {
                const [possiblyFrom, possiblyTo] = pos
                    .split("-")
                    .map((x) => parseInt(x) - 1);
                if (!isNaN(possiblyFrom)) {
                    if (possiblyTo && !isNaN(possiblyTo)) {
                        newSongs.push(
                            ...this.searchResult.slice(
                                possiblyFrom,
                                possiblyTo + 1
                            )
                        );
                    } else {
                        newSongs.push(this.searchResult[possiblyFrom]);
                    }
                }
            }
            this.endSearchFlow();
        }

        if (!newSongs.length) {
            newSongs = await getSongs(arg);
            if (!newSongs.length) {
                this.messenger("Could not find song");
                return;
            }
        }

        this.songs.push(...newSongs);
        if (this.player.state.status !== AudioPlayerStatus.Idle) {
            if (newSongs.length > 1)
                this.messenger(`Enqueued ${newSongs.length} songs`);
            else this.messenger(songView(newSongs[0]));
        }

        if (!this.started) this.initPlayer();
    }

    private initPlayer() {
        if (!this.started) this.started = true;

        const next = this.nextSong();
        if (next) this.playSong(next);

        this.player.on(AudioPlayerStatus.Idle, () => {
            const next = this.nextSong();
            if (next) this.playSong(next);
            else this.quit();
        });

        this.player.on("error", (error) => {
            console.log(error);
            this.messenger("Error playing audio. Skipping");
            this.skip();
        });
    }

    private nextSong() {
        if (this.shouldLoopSong) return this.nowPlaying;

        const next = this.songs.shift();
        if (!next) return undefined;

        if (this.shouldLoopQueue) this.songs.push(next);

        return next;
    }

    private async playSong(song: Song) {
        const audioResource = createAudioResource(await getStream(song), {
            inputType: StreamType.Opus,
        });

        this.player.play(audioResource);

        this.nowPlaying = { ...song, elapsedTimer: new ElapsedTimer() };
        this.showNp();
    }
    private async pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
            this.nowPlaying?.elapsedTimer.pause();
            this.messenger("Paused");
        } else {
            this.messenger("Nothing is playing");
        }
    }

    private async resume() {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
            this.nowPlaying?.elapsedTimer.play();
        } else {
            this.messenger("No song specified");
        }
    }

    private async skip() {
        this.messenger("Skipped!");
        this.player.stop(true);
    }

    private async remove(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        const toRemove: number[] = [];
        for (const pos of arg.split(" ")) {
            const idx = parseInt(pos) - 1;
            if (isNaN(idx)) {
                this.invalid();
                return;
            }
            if (idx >= this.songs.length || idx < 0) {
                this.messenger(`There is nothing at position ${idx + 1}`);
            } else {
                toRemove.push(idx);
                this.messenger(
                    `Removed ${mdHyperlinkSong(this.songs[idx])} from the queue`
                );
            }
        }
        this.songs = this.songs.filter((_elem, idx) => !toRemove.includes(idx));
    }

    private async removeRange(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        let [from, to] = arg.split("-").map((x) => parseInt(x) - 1);
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (from < 0 || from >= this.songs.length) {
            this.messenger(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger("Invalid range");
            return;
        }
        if (to >= this.songs.length) to = this.songs.length - 1;
        this.songs.splice(from, to - from + 1);
        this.messenger(`Removed ${to - from + 1} songs from the queue`);
    }

    private async move(arg: string) {
        let [from, to] = arg.split(" ").map((x) => parseInt(x) - 1);
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (from < 0 || from >= this.songs.length) {
            this.messenger(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to < 0) {
            this.messenger(`Cannot move to ${to + 1}`);
            return;
        }
        if (to >= this.songs.length) to = this.songs.length - 1;

        const song = this.songs.splice(from, 1)[0];
        this.songs.splice(to, 0, song);
        this.messenger(`Moving ${mdHyperlinkSong(song)} to position ${to + 1}`);
    }

    private async moveRange(arg: string) {
        const [fromRange, toIndex] = arg.split(" ");
        let [from, to] = fromRange.split("-").map((x) => parseInt(x) - 1);
        let toIdx = parseInt(toIndex) - 1;
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (from < 0 || from >= this.songs.length) {
            this.messenger(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger("No range selected");
            return;
        }

        if (to >= this.songs.length) to = this.songs.length;

        if (isNaN(toIdx)) {
            this.invalid();
            return;
        }
        const spliced = this.songs.splice(from, to - from + 1);
        this.songs.splice(toIdx, 0, ...spliced);
        this.messenger(
            `Moving from position ${from + 1} to position ${to + 1}`
        );
    }

    private async keep(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        const toKeep: number[] = [];
        for (const pos of arg.split(" ")) {
            const idx = parseInt(pos) - 1;
            if (isNaN(idx)) {
                this.invalid();
                return;
            }
            if (idx >= this.songs.length || idx < 0) {
                this.messenger(`There is nothing at position ${idx + 1}`);
            } else {
                toKeep.push(idx);
                this.messenger(`Keeping ${mdHyperlinkSong(this.songs[idx])}`);
            }
        }
        this.songs = this.songs.filter((_elem, idx) => toKeep.includes(idx));
    }

    private async keepRange(arg: string) {
        let [from, to] = arg.split("-").map((x) => parseInt(x) - 1);
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (from < 0 || from >= this.songs.length) {
            this.messenger(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger("No range selected");
            return;
        }
        if (to >= this.songs.length) to = this.songs.length;

        this.songs = this.songs.filter(
            (_elem, idx) => idx >= from && idx <= to
        );
        this.messenger(`Kept ${to - from + 1} songs. Discarded the rest`);
    }

    private async clear() {
        this.songs = [];
        this.messenger("Cleared queue!");
    }

    private async skipto(arg: string) {
        if (!arg) return;
        const idx = parseInt(arg) - 1;
        if (isNaN(idx)) {
            this.invalid();
            return;
        }

        this.songs.splice(0, idx);

        this.skip();
    }

    private async playNow(arg: string) {
        try {
            const newSongs = await getSongs(arg);

            if (newSongs.length) {
                this.songs.unshift(...newSongs);
                this.player.stop();
            } else {
                this.messenger("Could not find song");
            }
        } catch (e) {
            console.log(e);
        }
    }

    private async toggleLoopQueue() {
        this.shouldLoopQueue = !this.shouldLoopQueue;

        this.messenger(
            this.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
        );
    }

    private async toggleLoop() {
        this.shouldLoopSong = !this.shouldLoopSong;

        if (this.nowPlaying) {
            if (this.shouldLoopSong)
                this.messenger(`Looping ${mdHyperlinkSong(this.nowPlaying)}`);
            else
                this.messenger(
                    `Cancelled loop on ${mdHyperlinkSong(this.nowPlaying)}`
                );
        } else {
            this.messenger("There is nothing playing");
        }
    }

    private async stashController(_arg: string) {
        if (!this.stashingAllowed) {
            this.messenger("Stashing is not possible right now, Sorry!");
            return;
        }
        const [subcmd, arg] = [getCmd(_arg), getArg(_arg)];
        if (!arg) {
            this.stashHelp();
            return;
        }
        for (const [_name, command] of Object.entries(this.stashCommands)) {
            if (command.triggers.includes(subcmd)) {
                command.handler(arg);
                break;
            }
        }
    }
    private stashHelp() {
        const introduction =
            "Jam-bot can save your queues with a name of your choice so you can access it later!\n\nNote that names **cannot** have spaces";
        //TODO helpView
    }

    private async stashPop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        const stored = (await Stash.pop(this.guildId, arg)) as Song[]; // TODO: make JSON compile-time guaranteed type
        if (stored) {
            this.songs.push(...stored);
            if (!this.started) {
                this.initPlayer();
            }
            this.messenger(
                `Appended ${stored.length} songs from ${arg} to the end of queue`
            );
        } else {
            this.messenger(`Could not find a list with name ${arg}`);
        }
    }

    private async stashPush(arg: string) {
        const [scope, name] = arg.split(" ");
        if (!scope || !name) {
            this.invalid();
            return;
        }
        let toBeStored: Song[] = [];
        if (scope === "*") {
            toBeStored = this.songs.slice();
        } else {
            const [from, to] = scope.split("-").map((x) => parseInt(x));
            if (isNaN(from) || isNaN(to)) {
                this.invalid();
                return;
            }
            toBeStored = this.songs.slice(from - 1, to);
        }
        if (toBeStored.length) {
            Stash.push(this.guildId, name, toBeStored);
            this.messenger(`Stored ${toBeStored.length} songs as ${name}`);
        } else {
            this.messenger("Cannot store empty queue");
        }
    }
    private async stashDrop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        Stash.drop(this.guildId, arg);
        this.messenger(`Dropped queue ${arg}`);
    }

    private async stashView(arg: string) {
        if (!arg) {
            const storedLists = await Stash.view(this.guildId);
            if (!storedLists || !Object.keys(storedLists).length) {
                this.messenger("There are no stashed queues");
                return;
            }
            for (const name in storedLists) {
                //TODO paginated list view
            }
        } else {
            const storedList = await Stash.view(this.guildId, arg);
            if (storedList) {
                //TODO paginated list view
                return;
            } else {
                this.messenger(`Could not find a list with name ${arg}`);
                return;
            }
        }
    }

    private async showQueue() {
        if (this.songs.length) {
            //TODO paginated list view
        } else {
            this.messenger("There is nothing queued!");
        }
    }

    private async showNp() {
        if (this.nowPlaying) {
            this.messenger(nowPlayingView(this.nowPlaying));
        } else {
            this.messenger("There is nothing playing right now");
        }
    }

    private async shutup() {
        this.silence = true;
    }

    private async unshutup() {
        this.silence = false;
    }

    private async invalid() {
        this.messenger("Invalid Command");
    }

    private async quit() {
        const con = getVoiceConnection(this.guildId);
        if (con) {
            this.messenger("_Disconnecting..._");
            con.disconnect();
        }

        this.onQuitCallback();
    }
}

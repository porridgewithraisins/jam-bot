import * as voice from "@discordjs/voice";
import * as Utils from "../common/Utils";
import * as Types from "../common/Types";
import * as Stash from "../services/stasher/Stash";
import * as Timer from "../services/timer/Timer";
import * as Views from "../views/Views";
import * as Messaging from "../services/interaction/Messaging";
import * as Searcher from "../services/searchers/Searcher";
import * as Fetcher from "../services/fetchers/Fetcher";
import * as Streamer from "../services/streamers/Streamer";

export class MusicPlayer {
    private readonly player: voice.AudioPlayer = voice.createAudioPlayer();
    private readonly guildId: string;
    private readonly messenger: Messaging.Messenger;

    //State variables
    private started = false;
    private songs: Types.Song[] = [];
    private nowPlaying: Types.NowPlaying | undefined;
    private isInSearchFlow = false;
    private searchResult: Types.Song[] = [];
    private shouldLoopSong = false;
    private shouldLoopQueue = false;
    private stashingAllowed = false;
    //State variables

    private readonly onQuitCallback: () => any;

    public readonly commands: Types.MusicPlayerCommandMap = {
        help: {
            description: "Show this help message",
            triggers: [Utils.prefixify("h"), Utils.prefixify("help")],
            handler: (_arg) => this.help(),
        },
        search: {
            description:
                "Search for a song, and then choose a position in it, to play",
            triggers: [Utils.prefixify("search")],
            handler: (arg) => this.search(arg),
        },
        play: {
            description:
                "`play [song name/url]`. Don't specify any song, to resume a\
                 paused song",
            triggers: [Utils.prefixify("p"), Utils.prefixify("play")],
            handler: (arg) => this.play(arg),
        },
        pause: {
            description: "Pause the currently playing song.",
            triggers: [Utils.prefixify("pause"), Utils.prefixify("stop")],
            handler: (_arg) => this.pause(),
        },
        np: {
            description: "Show the currently playing song",
            triggers: [Utils.prefixify("np"), Utils.prefixify("nowplaying")],
            handler: (_arg) => this.showNp(),
        },
        skip: {
            description: "Skip the current song in the queue",
            triggers: [Utils.prefixify("s"), Utils.prefixify("skip")],
            handler: (_arg) => this.skip(),
        },
        queue: {
            description: "Show the current queue",
            triggers: [Utils.prefixify("q"), Utils.prefixify("queue")],
            handler: (_arg) => this.showQueue(),
        },
        move: {
            description:
                "Use `queue` to find out the position of the songs you want to \
                move, and then use it like `move [from_position] [to_position]`",
            triggers: [Utils.prefixify("m"), Utils.prefixify("move")],
            handler: (arg) => this.move(arg),
        },
        moverange: {
            description:
                "Moves a range of the queue. For example, `moverange 1-3 7` \
                moves songs at position 1,2,3 in the queue to position 7",
            triggers: [Utils.prefixify("mr"), Utils.prefixify("moverange")],
            handler: (arg) => this.moveRange(arg),
        },
        remove: {
            description:
                "Use `queue` to find the position(s) of the song(s) you want to\
                 remove, and call `remove [position1] [position2] ...`.",
            triggers: [Utils.prefixify("remove"), Utils.prefixify("r")],
            handler: (arg) => this.remove(arg),
        },
        removerange: {
            description:
                "Removes specified range(s) from the queue. For example, \
                `removerange 1-3 4-6` removes songs at positions 1,2,3 and 4,5,6 in the queue",
            triggers: [Utils.prefixify("removerange"), Utils.prefixify("rr")],
            handler: (arg) => this.removeRange(arg),
        },
        keep: {
            description:
                "Opposite of `remove`. For example, `keep 1 3` keeps the \
                specified positions 1,3,...in the queue, and discards the rest.",
            triggers: [Utils.prefixify("keep"), Utils.prefixify("k")],
            handler: (arg) => this.keep(arg),
        },
        keeprange: {
            description:
                "Opposite of removerange. Keeps specified range(s) from the \
                queue. For example, `keeprange 1-3 4-6` keeps songs at \
                positions 1,2,3 and 4,5,6 and discards the rest",
            triggers: [Utils.prefixify("keeprange"), Utils.prefixify("kr")],
            handler: (arg) => this.keepRange(arg),
        },
        clear: {
            description: "Clears the current queue",
            triggers: [Utils.prefixify("clear"), Utils.prefixify("clr")],
            handler: (_arg) => this.clear(),
        },
        skipto: {
            description:
                "skipto [index] skips to the position in the queue, forgetting\
                 all the songs before it",
            triggers: [Utils.prefixify("skipto")],
            handler: (arg) => this.skipto(arg),
        },
        playnow: {
            description:
                "playnow [song name/url] plays the song immediately on the top\
                 of the queue, the rest of the queue remains intact and will \
                 play next",
            triggers: [Utils.prefixify("playnow"), Utils.prefixify("pn")],
            handler: (arg) => this.playNow(arg),
        },
        loop: {
            description: "Toggles loop of the current song.",
            triggers: [Utils.prefixify("loop"), Utils.prefixify("l")],
            handler: (_arg) => this.toggleLoop(),
        },
        loopq: {
            description: "Toggles loop of the current queue.",
            triggers: [Utils.prefixify("loopq"), Utils.prefixify("lq")],
            handler: (_arg) => this.toggleLoopQueue(),
        },
        stash: {
            description: `Stash the current queue away for later use. Run \
            ${Utils.prefixify("stash help")} for further details`,
            triggers: [Utils.prefixify("stash")],
            handler: (arg) => this.stashController(arg),
        },
        shutup: {
            description: "The music bot will stop sending text messages.",
            triggers: [Utils.prefixify("stfu"), Utils.prefixify("shutup")],
            handler: (_arg) => this.shutUp(),
        },
        speakagain: {
            description: "The bot will resume sending messages",
            triggers: [Utils.prefixify("talk"), Utils.prefixify("speak")],
            handler: (_arg) => this.unShutUp(),
        },
        clean: {
            description: "Cleans the bots messages",
            triggers: [Utils.prefixify("clean")],
            handler: (_arg) => this.cleanMessages(),
        },
        quit: {
            description: "Quits the voice channel, and destroys the queue.",
            triggers: [Utils.prefixify("quit"), Utils.prefixify("dc")],
            handler: (_arg) => this.quit(),
        },
    };

    public readonly stashCommands: Types.MusicPlayerCommandMap = {
        pop: {
            description:
                "Use `stash pop {name}` to append the saved list with name \
                `{name}`. For e.g `stash pop myList`",
            triggers: ["pop", "get"],
            handler: (arg) => this.stashPop(arg),
        },
        push: {
            description:
                "Use `stash push * {name}` to store the whole of the current \
                queue as `{name}`. For e.g `stash push * mylist`. Moreover, \
                `stash push {from}-{to} {name}` stores items from positions \
                {from} to {to} as {name}",
            triggers: ["push", "add", "new"],
            handler: (arg) => this.stashPush(arg),
        },
        drop: {
            description:
                "Use `stash drop {name}` to delete the saved list with name \
                `{name}`. For e.g, `stash drop myList`",
            triggers: ["drop", "del", "delete"],
            handler: (arg) => this.stashDrop(arg),
        },
        view: {
            description:
                "Use `stash view *` to view all stashed playlists, and `stash\
                 view {name}` to view the playlist named `{name}`",
            triggers: ["view", "list"],
            handler: (arg) => this.stashView(arg),
        },
    };

    constructor({
        textChannel,
        initialVoiceChannel: { id, guildId },
        adapterCreator,
        onQuitCallback,
    }: Types.MusicPlayerArgs) {
        this.messenger = new Messaging.Messenger(textChannel);
        this.guildId = guildId;
        this.onQuitCallback = onQuitCallback || (() => {});
        try {
            voice
                .joinVoiceChannel({
                    channelId: id,
                    guildId: this.guildId,
                    adapterCreator,
                })
                .subscribe(this.player);
        } catch (error) {
            console.error(error);
            this.messenger.send("Error connecting to the voice channel!");
        }
        this.stashingAllowed = Stash.init();
    }

    private parser(content: string): [string, string] {
        return [
            Utils.removeLinkMarkdown(Utils.getCmd(content)),
            Utils.removeLinkMarkdown(Utils.getArg(content)),
        ];
    }

    private delegator(cmd: string, arg: string) {
        for (const command of Object.values(this.commands)) {
            if (command.triggers.includes(cmd)) {
                return () => command.handler(arg);
            }
        }
        return undefined;
    }

    public async controller(content: string) {
        const [command, argument] = this.parser(content);
        const handler = this.delegator(command, argument);
        if (handler) handler();
    }

    private async help() {
        this.messenger.send(
            Object.entries(this.commands)
                .map(
                    ([, { description, triggers }]) =>
                        `**Commands**: ${triggers.join(", ")}\n` +
                        (description ? `**Description**: ${description}\n` : "")
                )
                .join("\n")
        );
    }

    private async search(arg: string) {
        this.messenger.sendTyping();
        const result = await Searcher.keywordSearch(arg);
        if (!result.length) {
            this.messenger.send(`No songs found matching your query ${arg}`);
            return;
        }
        this.startSearchFlow(result);
        this.messenger.paginate(
            Views.paginatedView(`Search for '${arg}'`, this.searchResult)
        );
    }

    private startSearchFlow(searchResult: Types.Song[]) {
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

        let newSongs: Types.Song[] = [];
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
            newSongs = await Fetcher.controller(arg);
            if (!newSongs.length) {
                this.messenger.send("Could not find song");
                return;
            }
        }

        this.songs.push(...newSongs);
        if (this.player.state.status !== voice.AudioPlayerStatus.Idle) {
            if (newSongs.length > 1)
                this.messenger.send(
                    `Added ${newSongs.length} songs to the queue`
                );
            else this.messenger.send(Views.songView(newSongs[0]));
        }

        if (!this.started) this.initPlayer();
    }

    private initPlayer() {
        if (!this.started) this.started = true;

        const next = this.nextSong();
        if (next) this.playSong(next);

        this.player.on(voice.AudioPlayerStatus.Idle, () => {
            const next = this.nextSong();
            if (next) this.playSong(next);
            else this.quit();
        });

        this.player.on("error", (error) => {
            console.log(error);
            this.messenger.send("Error playing audio. Skipping");
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

    private async playSong(song: Types.Song) {
        const audioResource = voice.createAudioResource(
            await Streamer.controller(song.url)
        );

        this.player.play(audioResource);
        this.nowPlaying = {
            ...song,
            elapsedTimer: new Timer.ElapsedTimer(song.duration),
        };
        this.showNp();
    }
    private async pause() {
        if (this.player.state.status === voice.AudioPlayerStatus.Playing) {
            this.player.pause();
            this.nowPlaying?.elapsedTimer.pause();
            this.messenger.send("Paused");
        } else {
            this.messenger.send("Nothing is playing");
        }
    }

    private async resume() {
        if (this.player.state.status === voice.AudioPlayerStatus.Paused) {
            this.player.unpause();
            this.nowPlaying?.elapsedTimer.play();
        } else {
            this.messenger.send("No song specified");
        }
    }

    private async skip() {
        this.messenger.send("Skipped!");
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
                this.messenger.send(`There is nothing at position ${idx + 1}`);
            } else {
                toRemove.push(idx);
                this.messenger.send(
                    `Removed ${Utils.mdHyperlinkSong(
                        this.songs[idx]
                    )} from the queue`
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
            this.messenger.send(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger.send("Invalid range");
            return;
        }
        if (to >= this.songs.length) to = this.songs.length - 1;
        this.songs.splice(from, to - from + 1);
        this.messenger.send(`Removed ${to - from + 1} songs from the queue`);
    }

    private async move(arg: string) {
        let [from, to] = arg.split(" ").map((x) => parseInt(x) - 1);
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (from < 0 || from >= this.songs.length) {
            this.messenger.send(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to < 0) {
            this.messenger.send(`Cannot move to ${to + 1}`);
            return;
        }
        if (to >= this.songs.length) to = this.songs.length - 1;

        const song = this.songs.splice(from, 1)[0];
        this.songs.splice(to, 0, song);
        this.messenger.send(
            `Moving ${Utils.mdHyperlinkSong(song)} to position ${to + 1}`
        );
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
            this.messenger.send(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger.send("No range selected");
            return;
        }

        if (to >= this.songs.length) to = this.songs.length;

        if (isNaN(toIdx)) {
            this.invalid();
            return;
        }
        const spliced = this.songs.splice(from, to - from + 1);
        this.songs.splice(toIdx, 0, ...spliced);
        this.messenger.send(
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
                this.messenger.send(`There is nothing at position ${idx + 1}`);
            } else {
                toKeep.push(idx);
                this.messenger.send(
                    `Keeping ${Utils.mdHyperlinkSong(this.songs[idx])}`
                );
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
            this.messenger.send(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to <= from) {
            this.messenger.send("No range selected");
            return;
        }
        if (to >= this.songs.length) to = this.songs.length;

        this.songs = this.songs.filter(
            (_elem, idx) => idx >= from && idx <= to
        );
        this.messenger.send(`Kept ${to - from + 1} songs. Discarded the rest`);
    }

    private async clear() {
        this.songs = [];
        this.messenger.send("Cleared queue!");
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
            const newSongs = await Fetcher.controller(arg);

            if (newSongs.length) {
                this.songs.unshift(...newSongs);
                this.player.stop();
            } else {
                this.messenger.send("Could not find song");
            }
        } catch (e) {
            console.log(e);
        }
    }

    private async toggleLoopQueue() {
        this.shouldLoopQueue = !this.shouldLoopQueue;

        this.messenger.send(
            this.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
        );
    }

    private async toggleLoop() {
        this.shouldLoopSong = !this.shouldLoopSong;

        if (this.nowPlaying) {
            if (this.shouldLoopSong)
                this.messenger.send(
                    `Looping ${Utils.mdHyperlinkSong(this.nowPlaying)}`
                );
            else
                this.messenger.send(
                    `Cancelled loop on ${Utils.mdHyperlinkSong(
                        this.nowPlaying
                    )}`
                );
        } else {
            this.messenger.send("There is nothing playing");
        }
    }

    private async stashController(_arg: string) {
        if (!this.stashingAllowed) {
            this.messenger.send("Stashing is not possible right now, Sorry!");
            return;
        }
        const [subcmd, arg] = [Utils.getCmd(_arg), Utils.getArg(_arg)];
        if (subcmd === "help") {
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
        this.messenger.send(
            [
                introduction,
                ...Object.entries(this.stashCommands).map(
                    ([, { description, triggers }]) =>
                        `**Commands**: ${triggers.join(", ")}\n` +
                        (description ? `**Description**: ${description}\n` : "")
                ),
            ].join("\n")
        );
    }

    private async stashPop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        const stored = (await Stash.pop(this.guildId, arg)) as Types.Song[];
        if (stored) {
            this.songs.push(...stored);
            if (!this.started) {
                this.initPlayer();
            }
            this.messenger.send(
                `Appended ${stored.length} songs from ${arg} to the end of queue`
            );
        } else {
            this.messenger.send(`Could not find a list with name ${arg}`);
        }
    }

    private async stashPush(arg: string) {
        const [scope, name] = arg.split(" ");
        if (!scope || !name) {
            this.invalid();
            return;
        }
        let toBeStored: Types.Song[] = [];
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
            this.messenger.send(`Stored ${toBeStored.length} songs as ${name}`);
        } else {
            this.messenger.send("Cannot store empty queue");
        }
    }
    private async stashDrop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        Stash.drop(this.guildId, arg);
        this.messenger.send(`Dropped queue ${arg}`);
    }

    private async stashView(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        if (arg === "*") {
            const storedLists = await Stash.view(this.guildId);
            if (!storedLists || !Object.keys(storedLists).length) {
                this.messenger.send("There are no stashed queues");
                return;
            }
            for (const name in storedLists) {
                this.showStashItem(name, storedLists[name]);
            }
        } else {
            const storedList = await Stash.view(this.guildId, arg);
            if (storedList) {
                this.showStashItem(arg, storedList);
                return;
            } else {
                this.messenger.send(`Could not find a list with name ${arg}`);
                return;
            }
        }
    }

    private showStashItem(name: string, list: Types.Song[]) {
        const revealLimit = 10;
        const nameText = `**${name}**`;
        const listText = list
            .slice(0, revealLimit)
            .map(
                (song, idx) => `**${idx + 1}.** ${Utils.mdHyperlinkSong(song)}`
            )
            .join("\n");
        const remaining = Utils.clampAtZero(list.length - revealLimit);
        const footerText = remaining > 0 ? `...and ${remaining} more` : "";
        this.messenger.send([nameText, listText, footerText].join("\n"));
    }

    private async showQueue() {
        if (this.songs.length) {
            this.messenger.paginate(Views.paginatedView("Queue", this.songs));
        } else {
            this.messenger.send("There is nothing queued!");
        }
    }

    private async showNp() {
        if (this.nowPlaying) {
            this.messenger.send(Views.nowPlayingView(this.nowPlaying));
        } else {
            this.messenger.send("There is nothing playing right now");
        }
    }

    private async shutUp() {
        this.messenger.shouldBeSilent = true;
    }

    private async unShutUp() {
        this.messenger.shouldBeSilent = false;
    }

    private async invalid() {
        this.messenger.send("Invalid Command");
    }

    private async cleanMessages() {
        await this.messenger.send("Cleaning messages...");
        const musicCommandRecognizer = (content: string) =>
            !!this.delegator(...this.parser(content));
        this.messenger.clean(musicCommandRecognizer);
    }

    private async quit() {
        const con = voice.getVoiceConnection(this.guildId);
        if (con) {
            this.messenger.send("_Disconnecting..._");
            con.disconnect();
        }

        this.onQuitCallback();
    }
}

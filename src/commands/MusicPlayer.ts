import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    StreamType,
} from "@discordjs/voice";
import { TextBasedChannels } from "discord.js";
import { getSongs, getStream, searchYoutube } from "../Songs";
import {
    prefixify,
    mdHyperlinkSong,
    embedMessage,
    getArg,
    showDuration,
    getCmd,
} from "../Message";
import { Song, MusicPlayerCommandMap, MusicPlayerArgs } from "../types";
import * as Stash from "../Stash";
export { MusicPlayer };

class MusicPlayer {
    private readonly player: AudioPlayer = createAudioPlayer();
    private readonly guildId: string;
    private readonly textChannel: TextBasedChannels;

    //State variables
    private started = false;
    private songs: Song[] = [];
    private nowPlaying: Song | undefined;
    private silence = false;
    private searchFlow = false;
    private searchResult: Song[] = [];
    private shouldLoopSong = false;
    private shouldLoopQueue = false;
    private currentSongTimeStamp = 0;
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
            triggers: [prefixify("pause"), prefixify("ps")],
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
            triggers: [prefixify("m"), prefixify("mov"), prefixify("move")],
            handler: (arg) => this.move(arg),
        },
        remove: {
            description:
                "Use `queue` to find the position of the song you want to remove, and call `remove [position]`. Not specifying position is the same as `skip`",
            triggers: [prefixify("remove"), prefixify("r")],
            handler: (arg) => this.remove(arg),
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
        sliceq: {
            description:
                "Filter the queue down to a slice of your choosing. For example, `sliceq 1 3`",
            triggers: [prefixify("sliceq")],
            handler: (arg) => this.sliceQueue(arg),
        },
        selectq: {
            description:
                "Selects explicitly mentioned positions of the queue. For example, `selectq 1 2 4 6`",
            triggers: [prefixify("selectq")],
            handler: (arg) => this.filterQueue(arg),
        },
        stash: {
            description: `Stash the current queue away for later use. Run ${prefixify(
                "stash help"
            )} for further details`,
            triggers: [prefixify("stash")],
            handler: (arg) => this.stash(arg),
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
            this.sendMsg("Error connecting to the voice channel!");
        }
        this.stashingAllowed = Stash.init();
    }

    public async execute(cmd: string, arg: string) {
        for (const command of Object.values(this.commands)) {
            if (command.triggers.includes(cmd)) {
                command.handler(arg);
                break;
            }
        }
    }

    private async sendMsg(text: string, thumbnail?: string) {
        if (!this.silence) this.textChannel.send(embedMessage(text, thumbnail));
    }

    private async help() {
        this.sendMsg(
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
        this.textChannel.sendTyping();
        const result = await searchYoutube(getArg(arg));
        if (!result.length) {
            this.sendMsg(`No songs found matching your query ${arg}`);
            return;
        }
        this.startSearchFlow(result);
        this.sendMsg(
            "**Search result**\n" +
                result
                    .map((song, idx) => `${idx + 1}: ${mdHyperlinkSong(song)}`)
                    .join("\n")
        );
    }

    private startSearchFlow(searchResult: Song[]) {
        [this.searchFlow, this.searchResult] = [true, searchResult];
    }

    private endSearchFlow() {
        [this.searchFlow, this.searchResult] = [false, []];
    }

    private async play(arg: string) {
        if (!arg) {
            this.resume();
            return;
        }
        const possiblyIdx = parseInt(arg) - 1;

        let newSongs: Song[] = [];

        if (this.searchFlow) newSongs = [this.searchResult[possiblyIdx]];

        if (!newSongs.length) {
            try {
                newSongs = await getSongs(arg);
            } catch (e) {
                console.log(e);
                return;
            }
            if (!newSongs.length) {
                this.sendMsg("Could not find song");
                return;
            }
        }

        if (this.searchFlow) this.endSearchFlow();
        this.songs.push(...newSongs);
        if (this.player.state.status !== AudioPlayerStatus.Idle) {
            if (newSongs.length > 1) this.sendMsg("Enqueued a playlist");
            else
                this.sendMsg(
                    mdHyperlinkSong(newSongs[0]),
                    newSongs[0].thumbnail
                );
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
            this.sendMsg("Error playing audio. Skipping");
            this.skip();
        });
    }

    private nextSong() {
        if (this.shouldLoopSong) return this.nowPlaying;

        const next = this.songs.shift();
        if (!next) return undefined;

        if (this.shouldLoopQueue) this.songs.push(next);

        this.nowPlaying = next;

        return next;
    }

    private async playSong(song: Song) {
        const audioResource = createAudioResource(await getStream(song), {
            inputType: StreamType.Opus,
        });

        this.player.play(audioResource);

        this.currentSongTimeStamp = Date.now();
        this.showNp();
    }
    private async pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
            this.sendMsg("Paused");
        } else {
            this.sendMsg("Nothing is playing");
        }
    }

    private async resume() {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
        } else {
            this.sendMsg("No song specified");
        }
    }

    private async skip() {
        this.sendMsg("Skipped!");
        this.player.stop(true);
    }

    private idxWithinBounds(idx: number) {
        return idx >= 0 && idx < this.songs.length;
    }

    private async remove(arg: string) {
        if (!arg) {
            this.skip();
            return;
        }

        const idx = parseInt(arg) - 1;
        if (isNaN(idx)) {
            this.invalid();
            return;
        }
        if (!this.idxWithinBounds(idx)) {
            this.sendMsg(`There is nothing at position ${idx + 1}`);
            return;
        }

        this.sendMsg(
            `Removed ${mdHyperlinkSong(
                this.songs.splice(idx, 1)[0]
            )} from the queue`
        );
    }

    private async move(arg: string) {
        let [from, to] = arg.split(" ").map((x) => parseInt(x) - 1);
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (!this.idxWithinBounds(from)) {
            this.sendMsg(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to < 0) {
            this.sendMsg(`Cannot move to ${to + 1}`);
            return;
        }
        if (to >= this.songs.length) to = this.songs.length - 1;

        const song = this.songs.splice(from, 1)[0];
        this.sendMsg(`Moving ${mdHyperlinkSong(song)} to position ${to + 1}`);
        this.songs.splice(to, 0, song);
    }

    private async sliceQueue(arg: string) {
        let [from, to] = arg.split(" ").map((x) => parseInt(x));
        if (isNaN(from) || isNaN(to)) {
            this.invalid();
            return;
        }
        if (!this.idxWithinBounds(from)) {
            this.sendMsg(`There is nothing at position ${from + 1}`);
            return;
        }
        if (to < 0) {
            this.sendMsg("Invalid field for to");
            return;
        }
        this.songs = this.songs.slice(from - 1, to);
        this.sendMsg("Sliced queue!");
    }

    private async filterQueue(arg: string) {
        const positions = arg.split(" ").map((x) => parseInt(x));
        if (positions.some(isNaN)) {
            this.invalid();
            return;
        }
        this.songs = this.songs.filter((_, i) => positions.includes(i + 1));
        this.sendMsg("Filtered queue!");
    }

    private async clear() {
        this.songs = [];
        this.sendMsg("Cleared queue!");
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
                this.sendMsg("Could not find song");
            }
        } catch (e) {
            console.log(e);
        }
    }

    private async toggleLoopQueue() {
        this.shouldLoopQueue = !this.shouldLoopQueue;

        this.sendMsg(
            this.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
        );
    }

    private async toggleLoop() {
        this.shouldLoopSong = !this.shouldLoopSong;

        if (this.nowPlaying) {
            if (this.shouldLoopSong)
                this.sendMsg(`Looping ${mdHyperlinkSong(this.nowPlaying)}`);
            else
                this.sendMsg(
                    `Cancelled loop on ${mdHyperlinkSong(this.nowPlaying)}`
                );
        } else {
            this.sendMsg("There is nothing playing");
        }
    }

    private async stash(_arg: string) {
        if (!this.stashingAllowed) {
            this.sendMsg("Stashing is not possible right now, Sorry!");
            return;
        }
        const [subcmd, arg] = [getCmd(_arg), getArg(_arg)];
        switch (subcmd) {
            case "pop":
                this.stashPop(arg);
                break;
            case "push":
                this.stashPush(arg);
                break;
            case "drop":
                this.stashDrop(arg);
                break;
            case "view":
                this.stashView(arg);
                break;
            case "help":
                this.stashHelp();
                break;
            default:
                this.invalid();
                return;
        }
    }
    private stashHelp() {
        const introduction =
            "Jam-bot can save your queues with a name of your choice so you can access it later!\n\nNote that names cannot have spaces";
        const helpHelp = "Use `stash help` to view this message";
        const popHelp =
            "Use `stash pop {name}` to append the saved list with name `{name}`. For e.g `stash pop myList`";
        const pushHelp =
            "Use `stash push * {name}` to store the whole of the current queue as `{name}`. For e.g `stash push * mylist`";
        const pushHelp2 =
            "Use `stash push {from}-{to}` to store the current queue from position `{from}` to position `{to}` as `{name}`. For e.g, `stash push 2-4 myList`";
        const viewHelp =
            "Use `stash view` to view all stashed playlists, and `stash view {name}` to view the playlist named `{name}`";
        const dropHelp =
            "Use `stash drop {name}` to delete the saved list with name `{name}`. For e.g, `stash drop myList`";
        this.sendMsg(
            [
                introduction,
                helpHelp,
                popHelp,
                pushHelp,
                pushHelp2,
                viewHelp,
                dropHelp,
            ].join("\n\n")
        );
    }

    private async stashPop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        const stored = (await Stash.pop(this.guildId, arg)) as Song[];
        if (stored) {
            this.songs.push(...stored);
            if (!this.started) {
                this.initPlayer();
            }
            this.sendMsg("Appended stored songs to end of queue");
        } else {
            this.sendMsg(`Could not find a list with name ${arg}`);
        }
    }

    private stashPush(arg: string) {
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
            this.sendMsg(`Stored as ${name}`);
        } else {
            this.sendMsg("Cannot store empty queue");
        }
    }
    private stashDrop(arg: string) {
        if (!arg) {
            this.invalid();
            return;
        }
        Stash.drop(this.guildId, arg);
        this.sendMsg(`Dropped queue ${arg}`);
    }

    private async stashView(arg: string) {
        if (!arg) {
            const storedLists = await Stash.view(this.guildId);
            if (!storedLists || !Object.keys(storedLists).length) {
                this.sendMsg("There are no stashed queues");
                return;
            }
            for (const name in storedLists) {
                this.showStashItem(name, storedLists[name]);
            }
        } else {
            const storedList = await Stash.view(this.guildId, arg);
            this.showStashItem(arg, storedList);
        }
    }

    private clampAtZero(x: number) {
        return x < 0 ? 0 : x;
    }
    private showStashItem(name: string, list: Song[]) {
        const revealLimit = 10;
        const nameText = `**${name}**`;
        const listText = list
            .slice(0, revealLimit)
            .map(({ title }, idx) => `**${idx + 1}.** ${title}\n`)
            .join("\n");
        const remaining = this.clampAtZero(list.length - revealLimit);
        const footerText = remaining > 0 ? `...and ${remaining} more` : "";
        this.sendMsg([nameText, listText, footerText].join("\n"));
    }

    private async showQueue() {
        const revealLimit = 15;
        const remaining = this.clampAtZero(this.songs.length - revealLimit);
        if (this.songs.length) {
            this.sendMsg(
                "**Queue**\n" +
                    this.songs
                        .slice(0, revealLimit)
                        .map(
                            (song, idx) =>
                                `${idx + 1} : ${mdHyperlinkSong(song)}`
                        )
                        .join("\n") +
                    (remaining ? `\n...and ${remaining} more` : "")
            );
        } else {
            this.sendMsg("There is nothing queued!");
        }
    }

    private async showNp() {
        if (this.nowPlaying) {
            this.sendMsg(
                `**Now playing:** ${mdHyperlinkSong(
                    this.nowPlaying
                )}    ${showDuration(
                    this.currentSongTimeStamp,
                    this.nowPlaying.timestamp
                )}`,
                this.nowPlaying.thumbnail
            );
        } else {
            this.sendMsg("There is nothing playing right now");
        }
    }

    private async shutup() {
        this.silence = true;
    }

    private async unshutup() {
        this.silence = false;
    }

    private async invalid() {
        this.sendMsg("Invalid Command");
    }

    private async quit() {
        const con = getVoiceConnection(this.guildId);
        if (con) {
            this.sendMsg("_Disconnecting..._");
            con.disconnect();
        }

        this.onQuitCallback();
    }
}

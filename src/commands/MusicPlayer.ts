import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
} from "@discordjs/voice";
import { TextBasedChannels } from "discord.js";
import { MusicPlayerArgs } from "../types/MusicPlayerArgs";
import { MusicPlayerCommandMap } from "../types/MusicPlayerCommand";
import { Song } from "../types/Song";
import { getSong, getStream, searchSong } from "../Songs";
import { prefixify, mdHyperlinkSong, embedMessage, getArg } from "../Message";

export { MusicPlayer };

class MusicPlayer {
    private started: boolean = false;
    private readonly player: AudioPlayer = createAudioPlayer();
    private readonly guildId: string;
    private readonly textChannel: TextBasedChannels;

    private songs: Song[] = [];
    private nowPlaying: Song | undefined = undefined;
    private readonly onQuitCallback: () => any;
    private silence = false;
    private searchFlow = false;
    private searchResult: Song[] = [];
    public readonly commands: MusicPlayerCommandMap = {
        help: {
            description: "Show this help message",
            triggers: [prefixify("h"), prefixify("help")],
            handler: (arg) => this.help(),
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
            handler: (arg) => this.pause(),
        },
        np: {
            description: "Show the currently playing song",
            triggers: [prefixify("np"), prefixify("nowplaying")],
            handler: (arg) => this.showNp(),
        },
        skip: {
            description: "Skip the current song in the queue",
            triggers: [prefixify("s"), prefixify("skip")],
            handler: (arg) => this.skip(),
        },
        queue: {
            description: "Show the current queue",
            triggers: [prefixify("q"), prefixify("queue")],
            handler: (arg) => this.showQueue(),
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
            triggers: [prefixify("remove")],
            handler: (arg) => this.remove(arg),
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
            handler: (arg) => this.playnow(arg),
        },
        shutup: {
            description: "The music bot will stop sending messages.",
            triggers: [prefixify("stfu"), prefixify("shutup")],
            handler: (arg) => this.shutup(),
        },
        speakagain: {
            description: "The bot will resume sending messages",
            triggers: [prefixify("talk"), prefixify("speak")],
            handler: (arg) => this.unshutup(),
        },
        quit: {
            description: "Quits the voice channel, and destroys the queue.",
            triggers: [prefixify("quit")],
            handler: (arg) => this.quit(),
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
    }

    async execute(cmd: string, arg: string) {
        for (const command of Object.values(this.commands)) {
            if (command.triggers.includes(cmd)) {
                command.handler(arg);
                break;
            }
        }
    }

    private async sendMsg(text: string) {
        this.textChannel.send(embedMessage(text));
    }

    async help() {
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

    async search(arg: string) {
        this.textChannel.sendTyping();
        const result = await searchSong(getArg(arg));
        if (!result) {
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

    async play(arg: string) {
        if (!arg) {
            this.resume();
            return;
        }
        let song: Song | undefined;
        const possibleIdx = parseInt(arg) - 1;
        if (this.searchFlow) {
            if (!this.searchResult[possibleIdx]) {
                this.invalid();
                this.endSearchFlow();
                return;
            }
            song = this.searchResult[possibleIdx];
            this.endSearchFlow();
        } else {
            song = await getSong(arg);
            if (!song) {
                this.sendMsg("Could not find song");
                return;
            }
        }
        this.songs.push(song);
        if (this.player.state.status !== AudioPlayerStatus.Idle)
            this.sendMsg(`Enqueued: ${mdHyperlinkSong(song)}`);
        if (!this.started) this.initPlayer();
    }

    async initPlayer() {
        this.started = true;
        if (this.songs.length)
            this.playSong((this.nowPlaying = this.songs.shift() as Song));
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.songs.length)
                this.playSong((this.nowPlaying = this.songs.shift() as Song));
            else this.quit();
        });
        this.player.on("error", (error) => {
            console.log(error);
            this.sendMsg("Error playing audio");
            this.quit();
        });
    }

    async playSong(song: Song) {
        this.player.play(createAudioResource(getStream(song)));
        this.sendMsg(`Now playing : ${mdHyperlinkSong(song)}`);
    }

    async pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
        } else {
            this.sendMsg("Nothing is playing");
        }
    }

    async resume() {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
        } else {
            this.sendMsg("No song specified");
        }
    }

    async skip() {
        this.sendMsg("Skipped!");
        this.player.stop(true);
    }

    private idxWithinBounds(idx: number) {
        return idx >= 0 && idx < this.songs.length;
    }

    async remove(arg: string) {
        if (!arg) {
            this.skip();
            return;
        }
        const idx = parseInt(arg) - 1;
        if (idx === NaN) {
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

    async move(arg: string) {
        let [from, to] = arg.split(" ").map((s) => parseInt(s) - 1);
        if (from === NaN || to === NaN) {
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

    async skipto(arg: string) {
        if (!arg) return;
        const idx = parseInt(arg) - 1;
        if (idx === NaN) {
            this.invalid();
            return;
        }
        this.songs.splice(0, idx);
        this.skip();
    }
    async playnow(arg: string) {
        const song = await getSong(arg);
        if (song) {
            this.songs.unshift(song);
            this.player.stop();
        } else {
        }
    }

    async showQueue() {
        if (this.songs.length) {
            this.sendMsg(
                "**Queue**\n" +
                    this.songs
                        .map(
                            (song, idx) =>
                                `${idx + 1} : ${mdHyperlinkSong(song)}`
                        )
                        .join("\n")
            );
        } else {
            this.sendMsg("There is nothing queued!");
        }
    }

    async showNp() {
        if (this.nowPlaying) {
            this.sendMsg(
                `**Now playing:** ${mdHyperlinkSong(this.nowPlaying)}`
            );
        } else {
            this.sendMsg("There is nothing playing right now");
        }
    }

    async shutup() {
        this.silence = true;
    }

    async unshutup() {
        this.silence = false;
    }

    async invalid() {
        this.sendMsg("Invalid Command");
    }

    async quit() {
        const con = getVoiceConnection(this.guildId);
        if (con) {
            this.sendMsg("_Disconnecting..._");
            con.disconnect();
        }
        this.onQuitCallback();
    }
}

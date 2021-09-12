import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    DiscordGatewayAdapterCreator,
    getVoiceConnection,
    joinVoiceChannel,
} from "@discordjs/voice";
import { Message, TextBasedChannels } from "discord.js";
import { Song } from "../types/Song";
import { getSong, getStream } from "../utils/youtube";

const commands = {
    play: ["_p", "_play"],
    pause: ["_pause"],
    np: ["_np"],
    skip: ["_s", "_skip"],
    queue: ["_q", "_queue"],
    quit: ["_quit"],
};

export class MusicPlayer {
    // the song queue
    songs: Song[];

    // the audio player, which voice connections can subscribe to
    player: AudioPlayer;

    // used to keep track of voice connections
    guildId: string;

    // used to send messages regarding the songs
    textChannel: TextBasedChannels;

    // is set to true once the player has been initialized, required due to discordjs audioplayer quirk
    started: boolean;

    // used to keep track of currently playing song, purely for the Now Playing command
    nowPlaying: Song | undefined;

    // will be called whenever the bot quits the voice channel
    // here it is used to cleanup the map entry in caller
    onQuitCallback: () => any;

    constructor(message: Message, onQuitCallback: () => any) {
        this.textChannel = message.channel;
        this.guildId = message.guild?.id as string;
        this.songs = [];
        this.player = createAudioPlayer();
        this.onQuitCallback = onQuitCallback;
        this.started = false;
        this.nowPlaying = undefined;

        joinVoiceChannel({
            channelId: message.member?.voice?.channel?.id as string,
            guildId: this.guildId,
            adapterCreator: message.guild
                ?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        }).subscribe(this.player);
    }

    execute(cmd: string, arg: string) {
        if (commands.play.includes(cmd)) {
            this.playHandler(arg);
        } else if (commands.pause.includes(cmd)) {
            this.pause();
        } else if (commands.np.includes(cmd)) {
            this.showNp();
        } else if (commands.skip.includes(cmd)) {
            this.skip();
        } else if (commands.queue.includes(cmd)) {
            this.showQueue();
        } else if (commands.quit.includes(cmd)) {
            this.quit();
        } else {
            this.invalid();
        }
    }

    playHandler(arg: string) {
        if (!arg) {
            this.resume();
            return;
        }
        getSong(arg).then((song) => {
            if (song) {
                this.songs.push(song);
                if (this.player.state.status !== AudioPlayerStatus.Idle)
                    this.textChannel.send(`Enqueued: ${song.title}`);
                if (!this.started) this.initPlayer();
            } else {
                this.textChannel.send("Could not find song");
                return;
            }
        });
    }

    initPlayer() {
        this.started = true;
        if (this.songs.length)
            this.play((this.nowPlaying = this.songs.shift() as Song));
        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.songs.length)
                this.play((this.nowPlaying = this.songs.shift() as Song));
            else this.quit();
        });
        this.player.on("error", (error) => {
            console.log(error);
            this.textChannel.send("Error playing audio");
            this.quit();
        });
    }

    // plays the given song in the player
    play(song: Song) {
        this.player.play(createAudioResource(getStream(song)));
        this.textChannel.send(`Now playing : ${song.title}`);
    }

    // pauses the player.
    // if the player was not playing, then notify user of the same
    pause() {
        if (this.player.state.status === AudioPlayerStatus.Playing) {
            this.player.pause();
        } else {
            this.textChannel.send("Nothing is playing");
        }
    }

    resume() {
        if (this.player.state.status === AudioPlayerStatus.Paused) {
            this.player.unpause();
        } else {
            this.textChannel.send("No song specified");
        }
    }

    skip() {
        this.textChannel.send("Skipped!");
        this.player.stop(true);
    }

    showQueue() {
        if (this.songs.length) {
            this.textChannel.send(
                "**Queue**\n" +
                    this.songs
                        .map((song, idx) => `${idx + 1} : ${song.title}`)
                        .join("\n")
            );
        } else {
            this.textChannel.send("There is nothing queued!");
        }
    }

    showNp() {
        if (this.nowPlaying) {
            this.textChannel.send(`Now playing: ${this.nowPlaying}`);
        } else {
            this.textChannel.send("There is nothing playing right now");
        }
    }

    invalid() {
        this.textChannel.send("Invalid message");
    }

    quit() {
        const con = getVoiceConnection(this.guildId);
        if (con) {
            this.textChannel.send("Disconnecting");
            con.disconnect();
        }
        this.onQuitCallback();
    }
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerQueue = void 0;
const voice_1 = require("@discordjs/voice");
const yt_search_1 = __importDefault(require("yt-search"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class ServerQueue {
    constructor(message) {
        var _a, _b, _c, _d, _e;
        this.textChannel = message.channel;
        this.guildId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
        this.channelId = (_d = (_c = (_b = message.member) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channel) === null || _d === void 0 ? void 0 : _d.id;
        this.voiceAdapter = (_e = message.guild) === null || _e === void 0 ? void 0 : _e.voiceAdapterCreator;
        this.songs = [];
        this.player = (0, voice_1.createAudioPlayer)();
        this.started = false;
        this.join();
    }
    join() {
        this.player.on(voice_1.AudioPlayerStatus.Idle, this.play);
        (0, voice_1.joinVoiceChannel)({
            channelId: this.channelId,
            guildId: this.guildId,
            adapterCreator: this.voiceAdapter,
        });
        const con = (0, voice_1.getVoiceConnection)(this.guildId);
        if (!con) {
            this.textChannel.send("Could not connect to voice channel");
            return;
        }
        con.subscribe(this.player);
    }
    enq(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userInput) {
                this.pauseOrResume();
                return;
            }
            const song = yield this.getSong(userInput);
            if (song) {
                this.songs = [...this.songs, song];
                if (!this.started) {
                    this.play();
                    this.started = true;
                }
                else {
                    this.textChannel.send(`Enqueued : ${song.title}`);
                }
            }
            else {
                this.textChannel.send("Could not find the song");
            }
        });
    }
    getSong(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ytdl_core_1.default.validateURL(userInput)) {
                const info = (yield ytdl_core_1.default.getInfo(userInput)).videoDetails;
                return {
                    title: info.title,
                    url: info.video_url,
                };
            }
            else {
                const searchResult = (yield (0, yt_search_1.default)(userInput)).videos;
                if (searchResult) {
                    return {
                        title: searchResult[0].title,
                        url: searchResult[0].url,
                    };
                }
                else {
                    return undefined;
                }
            }
        });
    }
    play() {
        console.log(this.songs, this.player.state.status);
        if (!this.songs)
            return;
        const nowPlaying = this.songs.shift();
        if (nowPlaying) {
            this.player.play((0, voice_1.createAudioResource)((0, ytdl_core_1.default)(nowPlaying.url, { filter: "audioonly" })));
            this.textChannel.send(`Now playing : ${nowPlaying.title}`);
        }
    }
    pauseOrResume() {
        if (this.player.state.status === voice_1.AudioPlayerStatus.Paused)
            this.player.unpause();
        else if (this.player.state.status === voice_1.AudioPlayerStatus.Playing)
            this.player.pause();
        else {
            this.textChannel.send("No song specified");
        }
    }
    skip() {
        this.player.stop(true);
    }
    show() {
        const msg = this.songs.map((song, idx) => `${idx + 1} : ${song.title}`);
        this.textChannel.send(msg.join("\n"));
    }
    quit() {
        const con = (0, voice_1.getVoiceConnection)(this.guildId);
        if (con) {
            this.textChannel.send("Disconnecting");
            con.disconnect();
        }
    }
}
exports.ServerQueue = ServerQueue;

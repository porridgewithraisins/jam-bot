import * as discordJs from "discord.js";
import * as discordJsVoice from "@discordjs/voice";
import * as Messaging from "../services/Messaging";
import * as Stash from "../services/Stash";
import * as Commands from "../commands/Commands";
import { Song, NowPlaying, MusicPlayerArgs } from "../common/Types";
import { configObj } from "../config/Config";
import { prefixify } from "../common/Utils";

export class MusicPlayer {
    readonly guild: discordJs.Guild;
    readonly messenger: Messaging.Messenger;
    readonly player = discordJsVoice.createAudioPlayer();
    readonly voiceCon: discordJsVoice.VoiceConnection;
    stashingAllowed = false;
    readonly onQuitCallback = () => {};

    //State variables
    started = false;
    songs: Song[] = [];
    nowPlaying: NowPlaying | undefined;
    isInSearchFlow = false;
    searchResult: Song[] = [];
    shouldLoopSong = false;
    shouldLoopQueue = false;
    votesForSkip = 0;
    //State variables

    static MusicPlayerCommands = [
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

    allCommands: Record<RecognizedCommands, Command> = {
        search: {
            handler: (ctx, arg) => Commands.search(ctx, arg),
            triggers: ["search"].map((cmd) => prefixify(cmd)),
        },
        play: {
            handler: (ctx, arg) => Commands.play(ctx, arg),
            triggers: ["p", "play"].map((cmd) => prefixify(cmd)),
        },
        lofi: {
            handler: (ctx, arg) => Commands.lofi(ctx, arg),
            triggers: ["lofi"].map((cmd) => prefixify(cmd)),
        },
        restart: {
            handler: (ctx, _arg) => Commands.restart(ctx),
            triggers: ["restart"].map((cmd) => prefixify(cmd)),
        },
        pause: {
            handler: (ctx, _arg) => Commands.pause(ctx),
            triggers: ["pause", "stop"].map((cmd) => prefixify(cmd)),
        },
        nowplaying: {
            handler: (ctx, _arg) => Commands.showNp(ctx),
            triggers: ["np", "nowplaying"].map((cmd) => prefixify(cmd)),
        },
        skip: {
            handler: (ctx, _arg) => Commands.skip(ctx),
            triggers: ["s", "skip"].map((cmd) => prefixify(cmd)),
        },
        voteskip: {
            handler: (ctx, _arg) => Commands.voteSkip(ctx),
            triggers: ["voteskip", "vs"].map((cmd) => prefixify(cmd)),
        },
        queue: {
            handler: (ctx, _arg) => Commands.showQueue(ctx),
            triggers: ["q", "queue"].map((cmd) => prefixify(cmd)),
        },
        move: {
            handler: (ctx, arg) => Commands.move(ctx, arg),
            triggers: ["m", "move"].map((cmd) => prefixify(cmd)),
        },
        moverange: {
            handler: (ctx, arg) => Commands.moveRange(ctx, arg),
            triggers: ["mr", "moverange"].map((cmd) => prefixify(cmd)),
        },
        remove: {
            handler: (ctx, arg) => Commands.remove(ctx, arg),
            triggers: ["remove", "r"].map((cmd) => prefixify(cmd)),
        },
        removerange: {
            handler: (ctx, arg) => Commands.removeRange(ctx, arg),
            triggers: ["removerange", "rr"].map((cmd) => prefixify(cmd)),
        },
        keep: {
            handler: (ctx, arg) => Commands.keep(ctx, arg),
            triggers: ["keep", "k"].map((cmd) => prefixify(cmd)),
        },
        keeprange: {
            handler: (ctx, arg) => Commands.keepRange(ctx, arg),
            triggers: ["keeprange", "kr"].map((cmd) => prefixify(cmd)),
        },
        clear: {
            handler: (ctx, _arg) => Commands.clearQueue(ctx),
            triggers: ["clear", "clr"].map((cmd) => prefixify(cmd)),
        },
        skipto: {
            handler: (ctx, arg) => Commands.skipTo(ctx, arg),
            triggers: ["skipto"].map((cmd) => prefixify(cmd)),
        },
        playnow: {
            handler: (ctx, arg) => Commands.playNow(ctx, arg),
            triggers: ["playnow", "pn"].map((cmd) => prefixify(cmd)),
        },
        loop: {
            handler: (ctx, _arg) => Commands.toggleLoop(ctx),
            triggers: ["loop", "l"].map((cmd) => prefixify(cmd)),
        },
        loopq: {
            handler: (ctx, _arg) => Commands.toggleLoopQueue(ctx),
            triggers: ["loopq", "lq"].map((cmd) => prefixify(cmd)),
        },
        shutup: {
            handler: (ctx, _arg) => Commands.shutUp(ctx),
            triggers: ["stfu", "shutup"].map((cmd) => prefixify(cmd)),
        },
        speakagain: {
            handler: (ctx, _arg) => Commands.unShutUp(ctx),
            triggers: ["talk", "speak"].map((cmd) => prefixify(cmd)),
        },
        clean: {
            handler: (ctx, _arg) => Commands.cleanMessages(ctx),
            triggers: ["clean"].map((cmd) => prefixify(cmd)),
        },
        quit: {
            handler: (ctx, _arg) => Commands.quit(ctx),
            triggers: ["quit", "dc"].map((cmd) => prefixify(cmd)),
        },
        ["stash pop"]: {
            handler: (ctx, arg) => Commands.stashPop(ctx, arg),
            triggers: ["stash pop", "stash get"].map((cmd) => prefixify(cmd)),
        },
        ["stash push"]: {
            handler: (ctx, arg) => Commands.stashPush(ctx, arg),
            triggers: ["stash push", "stash add"].map((cmd) => prefixify(cmd)),
        },
        ["stash drop"]: {
            handler: (ctx, arg) => Commands.stashDrop(ctx, arg),
            triggers: ["stash drop"].map((cmd) => prefixify(cmd)),
        },
        ["stash view"]: {
            handler: (ctx, arg) => Commands.stashView(ctx, arg),
            triggers: ["stash view"].map((cmd) => prefixify(cmd)),
        },
    };

    constructor({
        textChannel,
        voiceChannel,
        onQuitCallback,
    }: MusicPlayerArgs) {
        this.guild = voiceChannel.guild;
        this.messenger = new Messaging.Messenger(textChannel);
        this.onQuitCallback = onQuitCallback;
        this.voiceCon = discordJsVoice
            .joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: this.guild.id,
                adapterCreator: this.guild.voiceAdapterCreator,
            })
            .on("error", (error) => {
                console.error(error);
                try {
                    this.messenger.send(
                        "Error connecting to the voice channel!"
                    );
                } catch (e) {}
            });

        this.voiceCon.subscribe(this.player);
        this.stashingAllowed = Stash.init();
        this.initializeRolesAndPermissions();
        this.messenger.send(
            `:musical_note: Joined ${voiceChannel} and bound to ${textChannel}`
        );
    }
    initializeRolesAndPermissions = () => {
        Object.values(this.allCommands).forEach(
            (command) => (command.exclusiveTo = [])
        );

        this.allCommands.lofi.exclusiveTo = this.allCommands.play.exclusiveTo;
        this.allCommands.voteskip.exclusiveTo = [];
        const perms = Object.entries(configObj.permissions || {});
        for (const [role, cmdsExclusiveToThisRole] of perms) {
            cmdsExclusiveToThisRole.forEach((cmd) =>
                this.allCommands[cmd].exclusiveTo!.push(role)
            );
        }

        Object.freeze(this.allCommands);
    };
}

export interface Command {
    triggers: string[];
    handler: (ctx: MusicPlayer, arg: string) => Promise<void>;
    exclusiveTo?: string[];
}

export type RecognizedCommands = typeof MusicPlayer.MusicPlayerCommands[number];

import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import {
    Guild, StageChannel, TextBasedChannels,
    VoiceChannel
} from "discord.js";
import { CommandRegistry } from "../registry/CommandRegistry";
import { configObj } from "../common/Config";
import { Messenger } from "../services/Messaging";
import * as Stash from "../services/Stash";
import { NowPlaying, Song } from "./Song";

export class MusicPlayer {
    readonly guild: Guild;
    readonly messenger: Messenger;
    readonly player = createAudioPlayer();
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
    permissions: Record<string, string[]> = {};
    //State variables

    constructor({
        textChannel,
        voiceChannel,
        onQuitCallback,
    }: MusicPlayerArgs) {
        this.guild = voiceChannel.guild;
        this.messenger = new Messenger(textChannel);
        this.onQuitCallback = onQuitCallback;
        joinVoiceChannel({
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
            })
            .subscribe(this.player);
        this.stashingAllowed = Stash.init();
        this.initializeRolesAndPermissions();
        this.messenger.send(
            `:musical_note: Joined ${voiceChannel} and bound to ${textChannel}`
        );
    }
    initializeRolesAndPermissions = () => {
        Object.keys(CommandRegistry).forEach(
            (cmd) => (this.permissions[cmd] = [])
        );
        this.permissions.lofi = this.permissions.play;
        this.permissions.voteskip = [];
        const perms = Object.entries(configObj.permissions || {});
        for (const [role, cmdsExclusiveToThisRole] of perms) {
            cmdsExclusiveToThisRole.forEach((cmd) =>
                this.permissions[cmd].push(role)
            );
        }

        Object.freeze(CommandRegistry);
    };
}

export interface MusicPlayerArgs {
    textChannel: TextBasedChannels;
    voiceChannel: VoiceChannel | StageChannel;
    onQuitCallback: () => {};
}

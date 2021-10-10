import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import { Guild, Message, TextChannel, VoiceChannel } from "discord.js";
import { CommandRegistry } from "../commands/Command.Registry";
import { configObj } from "../common/Config";
import { Messenger } from "../services/Messaging";
import * as Stash from "../services/Stash";
import { NowPlaying } from "./NowPlaying.Model";
import { Song } from "./Song.Model";

export class MusicPlayer {
    readonly guild: Guild;
    readonly messenger: Messenger<TextChannel>;
    readonly player = createAudioPlayer();
    readonly stashingAllowed: boolean;
    readonly onQuitCallback = () => {};

    //State variables
    shouldKickStart = true;
    songs: Song[] = [];
    nowPlaying: NowPlaying | undefined;
    lastPlayed: Song | undefined;
    isInSearchFlow = false;
    searchResult: Song[] = [];
    shouldLoopSong = false;
    shouldLoopQueue = false;
    votesForSkip = 0;
    voteSkipMsg: Message | undefined;
    permissions: Record<string, string[]> = {};
    idleTimer = setTimeout(() => {});
    //State variables

    constructor({ text, voice, onQuit }: MusicPlayerArgs) {
        this.guild = voice.guild;
        this.messenger = new Messenger(text);
        this.onQuitCallback = onQuit;

        this.initVoice(voice);

        this.stashingAllowed = Stash.init();

        this.setRolesAndPermissions();

        this.messenger.send(
            `:musical_note: Joined ${voice} and bound to ${text}`
        );
    }

    initVoice(voice: VoiceChannel) {
        joinVoiceChannel({
            channelId: voice.id,
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
    }

    setRolesAndPermissions() {
        Object.keys(CommandRegistry).forEach(
            (cmd) => (this.permissions[cmd] = [])
        );
        this.permissions.lofi = this.permissions.play;
        this.permissions.voteskip = [];
        this.permissions.skipto = this.permissions.skip;
        const perms = Object.entries(configObj.permissions || {});
        for (const [role, cmdsExclusiveToThisRole] of perms) {
            cmdsExclusiveToThisRole.forEach((cmd) =>
                this.permissions[cmd].push(role)
            );
        }
    }
}

export interface MusicPlayerArgs {
    text: TextChannel;
    voice: VoiceChannel;
    onQuit: () => {};
}

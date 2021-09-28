// import * as discordJs from "discord.js";
// import * as discordJsVoice from "@discordjs/voice";
// import * as Utils from "../common/Utils";
// import * as Stash from "../services/Stash";
// import * as Timer from "../services/Timer";
// import * as Views from "../services/Views";
// import * as Messaging from "../services/Messaging";
// import * as Searcher from "../services/Searcher";
// import * as Fetcher from "../services/Fetcher";
// import * as Streamer from "../services/Streamer";
// import { Song, NowPlaying, MusicPlayerArgs } from "../common/Types";
// import { configObj } from "../config/Config";
// import * as ToYoutube from "../services/ToYoutube";

// interface Command {
//     triggers: string[];
//     handler: (arg: string) => Promise<void>;
//     exclusiveTo?: string[];
// }

// export type RecognizedCommands = typeof MusicPlayer.MusicPlayerCommands[number];

// export class MusicPlayer {
//     readonly guild: discordJs.Guild;
//     readonly messenger: Messaging.Messenger;
//     readonly player = discordJsVoice.createAudioPlayer();
//     voiceCon: discordJsVoice.VoiceConnection;
//     stashingAllowed = false;
//     onQuitCallback = () => {};

//     //State variables
//     started = false;
//     songs: Song[] = [];
//     nowPlaying: NowPlaying | undefined;
//     isInSearchFlow = false;
//     searchResult: Song[] = [];
//     shouldLoopSong = false;
//     shouldLoopQueue = false;
//     votesForSkip = 0;
//     //State variables

//     public static MusicPlayerCommands = [
//         "search",
//         "play",
//         "lofi",
//         "restart",
//         "pause",
//         "nowplaying",
//         "skip",
//         "voteskip",
//         "queue",
//         "move",
//         "moverange",
//         "remove",
//         "removerange",
//         "keep",
//         "keeprange",
//         "clear",
//         "skipto",
//         "playnow",
//         "loop",
//         "loopq",
//         "shutup",
//         "speakagain",
//         "clean",
//         "quit",
//         "stash pop",
//         "stash push",
//         "stash drop",
//         "stash view",
//     ] as const;

//     commands: Record<RecognizedCommands, Command> = {
//         search: {
//             handler: (arg) => this.search(arg),
//             triggers: ["search"].map(Utils.prefixify),
//         },
//         play: {
//             handler: (arg) => this.play(arg),
//             triggers: ["p", "play"].map(Utils.prefixify),
//         },
//         lofi: {
//             handler: (arg) => this.lofi(arg),
//             triggers: ["lofi"].map(Utils.prefixify),
//         },
//         restart: {
//             handler: (_arg) => this.restart(),
//             triggers: ["restart"].map(Utils.prefixify),
//         },
//         pause: {
//             handler: (_arg) => this.pause(),
//             triggers: ["pause", "stop"].map(Utils.prefixify),
//         },
//         nowplaying: {
//             handler: (_arg) => this.showNp(),
//             triggers: ["np", "nowplaying"].map(Utils.prefixify),
//         },
//         skip: {
//             handler: (_arg) => this.skip(),
//             triggers: ["s", "skip"].map(Utils.prefixify),
//         },
//         voteskip: {
//             handler: (_arg) => this.voteSkip(),
//             triggers: ["voteskip", "vs"].map(Utils.prefixify),
//         },
//         queue: {
//             handler: (_arg) => this.showQueue(),
//             triggers: ["q", "queue"].map(Utils.prefixify),
//         },
//         move: {
//             handler: (arg) => this.move(arg),
//             triggers: ["m", "move"].map(Utils.prefixify),
//         },
//         moverange: {
//             handler: (arg) => this.moveRange(arg),
//             triggers: ["mr", "moverange"].map(Utils.prefixify),
//         },
//         remove: {
//             handler: (arg) => this.remove(arg),
//             triggers: ["remove", "r"].map(Utils.prefixify),
//         },
//         removerange: {
//             handler: (arg) => this.removeRange(arg),
//             triggers: ["removerange", "rr"].map(Utils.prefixify),
//         },
//         keep: {
//             handler: (arg) => this.keep(arg),
//             triggers: ["keep", "k"].map(Utils.prefixify),
//         },
//         keeprange: {
//             handler: (arg) => this.keepRange(arg),
//             triggers: ["keeprange", "kr"].map(Utils.prefixify),
//         },
//         clear: {
//             handler: (_arg) => this.clear(),
//             triggers: ["clear", "clr"].map(Utils.prefixify),
//         },
//         skipto: {
//             handler: (arg) => this.skipto(arg),
//             triggers: ["skipto"].map(Utils.prefixify),
//         },
//         playnow: {
//             handler: (arg) => this.playNow(arg),
//             triggers: ["playnow", "pn"].map(Utils.prefixify),
//         },
//         loop: {
//             handler: (_arg) => this.toggleLoop(),
//             triggers: ["loop", "l"].map(Utils.prefixify),
//         },
//         loopq: {
//             handler: (_arg) => this.toggleLoopQueue(),
//             triggers: ["loopq", "lq"].map(Utils.prefixify),
//         },
//         shutup: {
//             handler: (_arg) => this.shutUp(),
//             triggers: ["stfu", "shutup"].map(Utils.prefixify),
//         },
//         speakagain: {
//             handler: (_arg) => this.unShutUp(),
//             triggers: ["talk", "speak"].map(Utils.prefixify),
//         },
//         clean: {
//             handler: (_arg) => this.cleanMessages(),
//             triggers: ["clean"].map(Utils.prefixify),
//         },
//         quit: {
//             handler: (_arg) => this.quit(),
//             triggers: ["quit", "dc"].map(Utils.prefixify),
//         },
//         ["stash pop"]: {
//             handler: (arg) => this.stashController("pop", arg),
//             triggers: ["stash pop", "stash get"].map(Utils.prefixify),
//         },
//         ["stash push"]: {
//             handler: (arg) => this.stashController("push", arg),
//             triggers: ["stash push", "stash add"].map(Utils.prefixify),
//         },
//         ["stash drop"]: {
//             handler: (arg) => this.stashController("drop", arg),
//             triggers: ["stash drop"].map(Utils.prefixify),
//         },
//         ["stash view"]: {
//             handler: (arg) => this.stashController("view", arg),
//             triggers: ["stash view"].map(Utils.prefixify),
//         },
//     };

//     constructor({
//         textChannel,
//         voiceChannel,
//         onQuitCallback,
//     }: MusicPlayerArgs) {
//         this.guild = voiceChannel.guild;
//         this.messenger = new Messaging.Messenger(textChannel);
//         this.onQuitCallback = onQuitCallback;
//         this.voiceCon = discordJsVoice
//             .joinVoiceChannel({
//                 channelId: voiceChannel.id,
//                 guildId: this.guild.id,
//                 adapterCreator: this.guild.voiceAdapterCreator,
//             })
//             .on("error", (error) => {
//                 console.error(error);
//                 try {
//                     this.messenger.send(
//                         "Error connecting to the voice channel!"
//                     );
//                 } catch (e) {}
//             });

//         this.voiceCon.subscribe(this.player);
//         this.stashingAllowed = Stash.init();
//         this.initializeRolesAndPermissions();
//         this.messenger.send(
//             `:musical_note: Joined ${voiceChannel} and bound to ${textChannel}`
//         );
//     }
//     initializeRolesAndPermissions() {
//         Object.values(this.commands).forEach(
//             (command) => (command.exclusiveTo = [])
//         );

//         this.commands.lofi.exclusiveTo = this.commands.play.exclusiveTo;
//         this.commands.voteskip.exclusiveTo = [];
//         const perms = Object.entries(configObj.permissions || {});
//         for (const [role, cmdsExclusiveToThisRole] of perms) {
//             cmdsExclusiveToThisRole.forEach((cmd) =>
//                 this.commands[cmd].exclusiveTo!.push(role)
//             );
//         }

//         Object.freeze(this.commands);
//     }
//     public async controller(message: discordJs.Message) {
//         if (
//             this.voiceCon.state.status ===
//             discordJsVoice.VoiceConnectionStatus.Disconnected
//         ) {
//             this.voiceCon.rejoin();
//         }
//         const { cmd, arg } = this.parser(message.content);
//         const delegation = this.delegator(message.member!, cmd, arg);
//         if (delegation) delegation();
//     }

//     parser(content: string) {
//         const parts = content.split(" ").map((str) => str.trim());
//         const splitPoint =
//             parts[0].toLowerCase() === Utils.prefixify("stash") ? 2 : 1;
//         return {
//             cmd: Utils.removeLinkMarkdown(
//                 parts.slice(0, splitPoint).join(" ")
//             ).toLowerCase(),
//             arg: Utils.removeLinkMarkdown(parts.slice(splitPoint).join(" ")),
//         };
//     }

//     findCommand(cmd: string) {
//         return Object.values(this.commands).find((command) =>
//             command.triggers.includes(cmd)
//         );
//     }

//     delegator(user: discordJs.GuildMember, cmd: string, arg: string) {
//         const command = this.findCommand(cmd);
//         return command
//             ? this.hasPermissions(user, command)
//                 ? () => command.handler(arg)
//                 : () => this.noPermission(user, cmd)
//             : undefined;
//     }

//     hasPermissions(user: discordJs.GuildMember, cmd: Command) {
//         // helper function
//         const userHasRole = (user: discordJs.GuildMember, role: string) =>
//             user.roles.cache.some((userRole) => userRole.name === role);

//         // if the command has not been restricted at all
//         if (cmd.exclusiveTo!.length === 0) return true;

//         // if the user is part of the exclusive list
//         if (cmd.exclusiveTo!.some((role) => userHasRole(user, role)))
//             return true;

//         // at this stage, only way this command will be allowed is if allowUnattended = true
//         // AND there is no one else in the voice channel with an exclusiveTo role.

//         return (
//             configObj.allowUnattended &&
//             user.voice.channel!.members.some(
//                 (fellow) =>
//                     fellow.id !== user.id &&
//                     !fellow.user.bot && // ignore bots thereby ignoring JamBot itself.
//                     cmd.exclusiveTo!.some((role) => userHasRole(fellow, role))
//             )
//         );
//     }

//     async noPermission(user: discordJs.GuildMember, cmd: string) {
//         this.messenger.send(
//             user.toString() + " does not have permission for `" + cmd + "`"
//         );
//     }

//     // async search(arg: string) {
//     //     this.messenger.sendTyping();
//     //     const result = await Searcher.keywordSearch(arg);
//     //     if (!result.length) {
//     //         this.messenger.send(`No songs found matching your query ${arg}`);
//     //         return;
//     //     }
//     //     this.startSearchFlow(result);
//     //     this.messenger.paginate(
//     //         Views.paginatedView(`Search for '${arg}'`, this.searchResult)
//     //     );
//     // }

//     // startSearchFlow(searchResult: Song[]) {
//     //     [this.isInSearchFlow, this.searchResult] = [true, searchResult];
//     // }

//     // endSearchFlow() {
//     //     [this.isInSearchFlow, this.searchResult] = [false, []];
//     // }

//     // async play(arg: string) {
//     //     if (!arg) {
//     //         this.resume();
//     //         return;
//     //     }

//     //     let newSongs: Song[] = [];
//     //     if (this.isInSearchFlow) {
//     //         for (const pos of arg.split(" ")) {
//     //             const [possiblyFrom, possiblyTo] = pos
//     //                 .split("-")
//     //                 .map((x) => parseInt(x) - 1);
//     //             if (!isNaN(possiblyFrom)) {
//     //                 if (possiblyTo && !isNaN(possiblyTo)) {
//     //                     newSongs.push(
//     //                         ...this.searchResult.slice(
//     //                             possiblyFrom,
//     //                             possiblyTo + 1
//     //                         )
//     //                     );
//     //                 } else {
//     //                     newSongs.push(this.searchResult[possiblyFrom]);
//     //                 }
//     //             }
//     //         }
//     //         this.endSearchFlow();
//     //     }

//     //     if (!newSongs.length) {
//     //         for (let _arg of arg.split(",")) {
//     //             _arg = _arg.trim();
//     //             this.messenger.sendTyping();
//     //             if (_arg) newSongs.push(...(await Fetcher.fetchSong(_arg)));
//     //         }
//     //         if (!newSongs.length) {
//     //             this.messenger.send("Could not find song");
//     //             return;
//     //         }
//     //     }
//     //     this.songs.push(...newSongs);
//     //     if (
//     //         this.player.state.status !== discordJsVoice.AudioPlayerStatus.Idle
//     //     ) {
//     //         if (newSongs.length > 1)
//     //             this.messenger.send(
//     //                 `Added ${newSongs.length} songs to the queue`
//     //             );
//     //         else this.messenger.send(Views.songView(newSongs[0]));
//     //     }

//     //     if (!this.started) this.initPlayer();
//     // }

//     // async lofi(arg: string) {
//     //     const which = parseInt(arg);
//     //     if (which === 1)
//     //         this.play("https://www.youtube.com/watch?v=5qap5aO4i9A");
//     //     else if (which === 2)
//     //         this.play("https://www.youtube.com/watch?v=DWcJFNfaw9c");
//     //     else this.invalid();
//     // }

//     // initPlayer() {
//     //     if (!this.started) this.started = true;

//     //     const onPlayerIdle = () => {
//     //         const next = this.nextSong();
//     //         if (next) {
//     //             this.playSong(next);
//     //             this.votesForSkip = 0;
//     //         } else this.quit();
//     //     };

//     //     onPlayerIdle();
        
//     //     this.player.on(discordJsVoice.AudioPlayerStatus.Idle, () =>
//     //         onPlayerIdle()
//     //     );

//     //     this.player.on("error", (error) => {
//     //         console.log(error);
//     //         this.messenger.send("Error playing audio. Skipping");
//     //         this.skip();
//     //     });
//     // }

//     // isPlayerPaused() {
//     //     return [
//     //         discordJsVoice.AudioPlayerStatus.AutoPaused,
//     //         discordJsVoice.AudioPlayerStatus.Paused,
//     //     ].includes(this.player.state.status);
//     // }

//     // async restart() {
//     //     if (!this.nowPlaying) return;
//     //     this.songs.unshift(this.nowPlaying as Song);
//     //     this.player.stop(true);
//     //     this.messenger.send("Restarting the current song...");
//     // }

//     // nextSong() {
//     //     if (this.shouldLoopSong) return this.nowPlaying;

//     //     const next = this.songs.shift();
//     //     if (!next) return undefined;

//     //     if (this.shouldLoopQueue) this.songs.push(next);

//     //     return next;
//     // }

//     // async playSong(song: Song) {
//     //     const converted = await ToYoutube.convertInfo(song);
//     //     if (!converted) {
//     //         this.messenger.send("Could not play this song");
//     //         this.skip();
//     //         return;
//     //     }

//     //     song = converted;
//     //     const audioResource = discordJsVoice.createAudioResource(
//     //         await Streamer.stream(song)
//     //     );

//     //     try {
//     //         this.player.play(audioResource);
//     //     } catch (e) {}
//     //     this.nowPlaying = {
//     //         ...song,
//     //         elapsedTimer: new Timer.ElapsedTimer(song.duration),
//     //     };
//     //     this.showNp();
//     // }
//     // async pause() {
//     //     if (
//     //         this.player.state.status ===
//     //         discordJsVoice.AudioPlayerStatus.Playing
//     //     ) {
//     //         this.player.pause();
//     //         this.nowPlaying?.elapsedTimer.stop();
//     //         this.messenger.send("Paused");
//     //     } else {
//     //         this.messenger.send("There is nothing playing");
//     //     }
//     // }

//     // async resume() {
//     //     if (this.isPlayerPaused()) {
//     //         this.player.unpause();
//     //         this.nowPlaying?.elapsedTimer.start();
//     //         this.messenger.send("Resuming...");
//     //     } else {
//     //         this.messenger.send("No song specified");
//     //     }
//     // }

//     // async skip() {
//     //     this.messenger.send("Skipped!");
//     //     this.player.stop(true);
//     // }

//     // async voteSkip() {
//     //     this.votesForSkip++;
//     //     const total = this.guild.me!.voice.channel?.members?.size ?? 1;
//     //     const fellows = total - 1;
//     //     if (this.votesForSkip > fellows / 2) {
//     //         this.skip();
//     //         this.votesForSkip = 0;
//     //     }
//     // }

//     // async remove(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const toRemove: number[] = [];
//     //     for (const pos of arg.split(" ")) {
//     //         const idx = parseInt(pos) - 1;
//     //         if (isNaN(idx)) {
//     //             this.invalid();
//     //             return;
//     //         }
//     //         if (idx >= this.songs.length || idx < 0) {
//     //             this.messenger.send(`There is nothing at position ${idx + 1}`);
//     //         } else {
//     //             toRemove.push(idx);
//     //             this.messenger.send(
//     //                 `Removed ${Utils.mdHyperlinkSong(
//     //                     this.songs[idx]
//     //                 )} from the queue`
//     //             );
//     //         }
//     //     }
//     //     this.songs = this.songs.filter((_elem, idx) => !toRemove.includes(idx));
//     // }

//     // async removeRange(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const toRemove = new Set<number>();
//     //     for (const range of arg.split(" ")) {
//     //         let [from, to] = range.split("-").map((x) => parseInt(x) - 1);
//     //         if (isNaN(from) || isNaN(to)) {
//     //             this.invalid();
//     //             return;
//     //         }
//     //         if (from < 0 || from >= this.songs.length) {
//     //             this.messenger.send(`There is nothing at position ${from + 1}`);
//     //             return;
//     //         }
//     //         if (to <= from) {
//     //             this.messenger.send("Invalid range");
//     //             return;
//     //         }
//     //         if (to >= this.songs.length) to = this.songs.length - 1;
//     //         for (let i = from; i <= to; i++) toRemove.add(i);
//     //     }
//     //     this.songs = this.songs.filter((_elem, idx) => !toRemove.has(idx));

//     //     this.messenger.send(`Removed ${toRemove.size} songs from the queue`);
//     // }

//     // async move(arg: string) {
//     //     let [from, to] = arg.split(" ").map((x) => parseInt(x) - 1);
//     //     if (isNaN(from) || isNaN(to)) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     if (from < 0 || from >= this.songs.length) {
//     //         this.messenger.send(`There is nothing at position ${from + 1}`);
//     //         return;
//     //     }
//     //     if (to < 0) {
//     //         this.messenger.send(`Cannot move to ${to + 1}`);
//     //         return;
//     //     }
//     //     if (to >= this.songs.length) to = this.songs.length - 1;

//     //     const song = this.songs.splice(from, 1)[0];
//     //     this.songs.splice(to, 0, song);
//     //     this.messenger.send(
//     //         `Moving ${Utils.mdHyperlinkSong(song)} to position ${to + 1}`
//     //     );
//     // }

//     // async moveRange(arg: string) {
//     //     const [fromRange, toIndex] = arg.split(" ");
//     //     let [from, to] = fromRange.split("-").map((x) => parseInt(x) - 1);
//     //     let toIdx = parseInt(toIndex) - 1;
//     //     if (isNaN(from) || isNaN(to)) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     if (from < 0 || from >= this.songs.length) {
//     //         this.messenger.send(`There is nothing at position ${from + 1}`);
//     //         return;
//     //     }
//     //     if (to <= from) {
//     //         this.messenger.send("No range selected");
//     //         return;
//     //     }

//     //     if (to >= this.songs.length) to = this.songs.length;

//     //     if (isNaN(toIdx)) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const spliced = this.songs.splice(from, to - from + 1);
//     //     this.songs.splice(toIdx, 0, ...spliced);
//     //     this.messenger.send(
//     //         `Moving from position ${from + 1} to position ${to + 1}`
//     //     );
//     // }

//     // async keep(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const toKeep: number[] = [];
//     //     for (const pos of arg.split(" ")) {
//     //         const idx = parseInt(pos) - 1;
//     //         if (isNaN(idx)) {
//     //             this.invalid();
//     //             return;
//     //         }
//     //         if (idx >= this.songs.length || idx < 0) {
//     //             this.messenger.send(`There is nothing at position ${idx + 1}`);
//     //         } else {
//     //             toKeep.push(idx);
//     //             this.messenger.send(
//     //                 `Keeping ${Utils.mdHyperlinkSong(this.songs[idx])}`
//     //             );
//     //         }
//     //     }
//     //     this.songs = this.songs.filter((_elem, idx) => toKeep.includes(idx));
//     // }

//     // async keepRange(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const toKeep = new Set<number>();
//     //     for (const range of arg.split(" ")) {
//     //         let [from, to] = range.split("-").map((x) => parseInt(x) - 1);
//     //         if (isNaN(from) || isNaN(to)) {
//     //             this.invalid();
//     //             return;
//     //         }
//     //         if (from < 0 || from >= this.songs.length) {
//     //             this.messenger.send(`There is nothing at position ${from + 1}`);
//     //             return;
//     //         }
//     //         if (to <= from) {
//     //             this.messenger.send("No range selected");
//     //             return;
//     //         }
//     //         if (to >= this.songs.length) to = this.songs.length;
//     //         for (let i = from; i <= to; i++) toKeep.add(i);
//     //     }

//     //     this.songs = this.songs.filter((_elem, idx) => toKeep.has(idx));
//     //     this.messenger.send(`Kept ${toKeep.size} songs. Discarded the rest`);
//     // }

//     // async clear() {
//     //     this.songs = [];
//     //     this.messenger.send("Cleared queue!");
//     // }

//     // async skipto(arg: string) {
//     //     if (!arg) return;
//     //     const idx = parseInt(arg) - 1;
//     //     if (isNaN(idx)) {
//     //         this.invalid();
//     //         return;
//     //     }

//     //     this.songs.splice(0, idx);

//     //     this.skip();
//     // }

//     // async playNow(arg: string) {
//     //     let newSongs: Song[] = [];
//     //     for (const _arg of arg.split("&")) {
//     //         newSongs.push(...(await Fetcher.fetchSong(_arg.trim())));
//     //     }
//     //     if (newSongs.length) {
//     //         this.songs.unshift(...newSongs);
//     //         this.player.stop();
//     //     } else {
//     //         this.messenger.send("Could not find song");
//     //     }
//     // }

//     // async toggleLoopQueue() {
//     //     this.shouldLoopQueue = !this.shouldLoopQueue;

//     //     this.messenger.send(
//     //         this.shouldLoopQueue ? "Looping queue..." : "Cancelled loop queue"
//     //     );
//     // }

//     // async toggleLoop() {
//     //     this.shouldLoopSong = !this.shouldLoopSong;

//     //     if (this.nowPlaying) {
//     //         if (this.shouldLoopSong)
//     //             this.messenger.send(
//     //                 `Looping ${Utils.mdHyperlinkSong(this.nowPlaying)}`
//     //             );
//     //         else
//     //             this.messenger.send(
//     //                 `Cancelled loop on ${Utils.mdHyperlinkSong(
//     //                     this.nowPlaying
//     //                 )}`
//     //             );
//     //     } else {
//     //         this.messenger.send("There is nothing playing");
//     //     }
//     // }

//     // async stashController(
//     //     type: "pop" | "push" | "drop" | "view",
//     //     arg: string
//     // ) {
//     //     if (!this.stashingAllowed) {
//     //         this.messenger.send("Stashing is not possible right now, Sorry!");
//     //         return;
//     //     }
//     //     switch (type) {
//     //         case "pop":
//     //             this.stashPop(arg);
//     //             return;
//     //         case "push":
//     //             this.stashPush(arg);
//     //             return;
//     //         case "drop":
//     //             this.stashDrop(arg);
//     //             return;
//     //         case "view":
//     //             this.stashView(arg);
//     //             return;
//     //     }
//     // }

//     // async stashPop(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     const stored = (await Stash.pop(this.guild.id, arg)) as Song[];
//     //     if (stored) {
//     //         this.songs.push(...stored);
//     //         if (!this.started) {
//     //             this.initPlayer();
//     //         }
//     //         this.messenger.send(
//     //             `Appended ${stored.length} songs from ${arg} to the end of queue`
//     //         );
//     //     } else {
//     //         this.messenger.send(`Could not find a list with name ${arg}`);
//     //     }
//     // }

//     // async stashPush(arg: string) {
//     //     const [scope, name] = arg.split(" ");
//     //     if (!scope || !name) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     let toBeStored: Song[] = [];
//     //     if (scope === "*") {
//     //         toBeStored = this.songs.slice();
//     //     } else {
//     //         const [from, to] = scope.split("-").map((x) => parseInt(x));
//     //         if (isNaN(from) || isNaN(to)) {
//     //             this.invalid();
//     //             return;
//     //         }
//     //         toBeStored = this.songs.slice(from - 1, to);
//     //     }
//     //     if (toBeStored.length) {
//     //         Stash.push(this.guild.id, name, toBeStored);
//     //         this.messenger.send(`Stored ${toBeStored.length} songs as ${name}`);
//     //     } else {
//     //         this.messenger.send("Cannot store empty queue");
//     //     }
//     // }
//     // async stashDrop(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     Stash.drop(this.guild.id, arg === "*" ? undefined : arg);
//     //     if (arg == "*") this.messenger.send("Dropped all queues");
//     //     else this.messenger.send(`Dropped queue ${arg}`);
//     // }

//     // async stashView(arg: string) {
//     //     if (!arg) {
//     //         this.invalid();
//     //         return;
//     //     }
//     //     if (arg === "*") {
//     //         const storedLists = (await Stash.view(this.guild.id)) as Record<
//     //             string,
//     //             Song[]
//     //         >;
//     //         if (!storedLists || !Object.keys(storedLists).length) {
//     //             this.messenger.send("There are no stashed queues");
//     //             return;
//     //         }
//     //         for (const name in storedLists) {
//     //             this.showStashItem(name, storedLists[name]);
//     //         }
//     //     } else {
//     //         const storedList = (await Stash.view(this.guild.id, arg)) as Song[];
//     //         if (storedList) {
//     //             this.showStashItem(arg, storedList);
//     //             return;
//     //         } else {
//     //             this.messenger.send(`Could not find a list with name ${arg}`);
//     //             return;
//     //         }
//     //     }
//     // }

//     // showStashItem(name: string, list: Song[]) {
//     //     const revealLimit = 10;
//     //     const nameText = `**${name}**`;
//     //     const listText = list
//     //         .slice(0, revealLimit)
//     //         .map(
//     //             (song, idx) => `**${idx + 1}.** ${Utils.mdHyperlinkSong(song)}`
//     //         )
//     //         .join("\n");
//     //     const remaining = Utils.clampAtZero(list.length - revealLimit);
//     //     const footerText = remaining > 0 ? `...and ${remaining} more` : "";
//     //     this.messenger.send([nameText, listText, footerText].join("\n"));
//     // }

//     // async showQueue() {
//     //     if (this.songs.length) {
//     //         this.messenger.paginate(Views.paginatedView("Queue", this.songs));
//     //     } else {
//     //         this.messenger.send("There is nothing queued!");
//     //     }
//     // }

//     // async showNp() {
//     //     if (this.nowPlaying) {
//     //         this.messenger.send(Views.nowPlayingView(this.nowPlaying));
//     //     } else {
//     //         this.messenger.send("There is nothing playing right now");
//     //     }
//     // }

//     // async shutUp() {
//     //     this.messenger.shouldBeSilent = true;
//     // }

//     // async unShutUp() {
//     //     this.messenger.shouldBeSilent = false;
//     // }

//     // async invalid() {
//     //     this.messenger.send("Invalid Command");
//     // }

//     // async cleanMessages() {
//     //     await this.messenger.send("Cleaning messages...");
//     //     const musicCommandRecognizer = (content: string) =>
//     //         !!this.findCommand(this.parser(content).cmd);
//     //     this.messenger.clean(musicCommandRecognizer);
//     // }

//     // async quit() {
//     //     const con = discordJsVoice.getVoiceConnection(this.guild.id);
//     //     if (con) {
//     //         con.destroy();
//     //         this.messenger.send("_Disconnecting..._");
//     //     }
//     //     this.onQuitCallback();
//     // }
// }

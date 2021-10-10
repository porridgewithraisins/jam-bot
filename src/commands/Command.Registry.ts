import * as Utils from "../common/Utils";
import * as Commands from "./CommandExporter";
import { Command, RecognizedCommands } from "./RecognizedCommands";

export const CommandRegistry: Record<RecognizedCommands, Command> = {
    search: {
        handler: (ctx, arg) => Commands.search(ctx, arg),
        triggers: ["search"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    play: {
        handler: (ctx, arg) => Commands.play(ctx, arg),
        triggers: ["p", "play"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    lofi: {
        handler: (ctx, arg) => Commands.lofi(ctx, arg),
        triggers: ["lofi"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    restart: {
        handler: (ctx, _arg) => Commands.restart(ctx),
        triggers: ["restart"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    replay: {
        handler: (ctx, _arg) => Commands.replay(ctx),
        triggers: ["replay", "prev"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    pause: {
        handler: (ctx, _arg) => Commands.pause(ctx),
        triggers: ["pause", "stop"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    nowplaying: {
        handler: (ctx, _arg) => Commands.showNp(ctx),
        triggers: ["np", "nowplaying"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    skip: {
        handler: (ctx, _arg) => Commands.skip(ctx),
        triggers: ["s", "skip"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    voteskip: {
        handler: (ctx, _arg) => Commands.voteSkip(ctx),
        triggers: ["voteskip", "vs"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    queue: {
        handler: (ctx, _arg) => Commands.showQueue(ctx),
        triggers: ["q", "queue"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    move: {
        handler: (ctx, arg) => Commands.move(ctx, arg),
        triggers: ["m", "move"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    moverange: {
        handler: (ctx, arg) => Commands.moveRange(ctx, arg),
        triggers: ["mr", "moverange"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    remove: {
        handler: (ctx, arg) => Commands.remove(ctx, arg),
        triggers: ["remove", "r"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    removerange: {
        handler: (ctx, arg) => Commands.removeRange(ctx, arg),
        triggers: ["removerange", "rr"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    keep: {
        handler: (ctx, arg) => Commands.keep(ctx, arg),
        triggers: ["keep", "k"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    keeprange: {
        handler: (ctx, arg) => Commands.keepRange(ctx, arg),
        triggers: ["keeprange", "kr"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    clear: {
        handler: (ctx, _arg) => Commands.clearQueue(ctx),
        triggers: ["clear", "clr"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    skipto: {
        handler: (ctx, arg) => Commands.skipTo(ctx, arg),
        triggers: ["skipto"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    playnow: {
        handler: (ctx, arg) => Commands.playNow(ctx, arg),
        triggers: ["playnow", "pn"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    loop: {
        handler: (ctx, _arg) => Commands.toggleLoop(ctx),
        triggers: ["loop", "l"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    loopq: {
        handler: (ctx, _arg) => Commands.toggleLoopQueue(ctx),
        triggers: ["loopq", "lq"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    shuffle: {
        handler: (ctx, _arg) => Commands.shuffle(ctx),
        triggers: ["shuffle"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    shutup: {
        handler: (ctx, _arg) => Commands.shutUp(ctx),
        triggers: ["stfu", "shutup"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    speakagain: {
        handler: (ctx, _arg) => Commands.unShutUp(ctx),
        triggers: ["speakagain", "talk", "speak"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    clean: {
        handler: (ctx, _arg) => Commands.cleanMessages(ctx),
        triggers: ["clean"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    quit: {
        handler: (ctx, _arg) => Commands.quit(ctx),
        triggers: ["quit", "dc"].map(Utils.prefixify),
        cmdTokens: 1,
    },
    "stash pop": {
        handler: (ctx, arg) => Commands.stashPop(ctx, arg),
        triggers: ["stash pop", "stash get"].map(Utils.prefixify),
        cmdTokens: 2,
    },
    "stash push": {
        handler: (ctx, arg) => Commands.stashPush(ctx, arg),
        triggers: ["stash push", "stash add"].map(Utils.prefixify),
        cmdTokens: 2,
    },
    "stash drop": {
        handler: (ctx, arg) => Commands.stashDrop(ctx, arg),
        triggers: ["stash drop"].map(Utils.prefixify),
        cmdTokens: 2,
    },
    "stash view": {
        handler: (ctx, arg) => Commands.stashView(ctx, arg),
        triggers: ["stash view"].map(Utils.prefixify),
        cmdTokens: 2,
    },
};

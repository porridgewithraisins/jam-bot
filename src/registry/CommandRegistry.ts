import * as Utils from "../common/Utils";
import * as Commands from "./CommandExporter";
import { Command, RecognizedCommands } from "./RecognizedCommands";

export const CommandRegistry: Record<RecognizedCommands, Command> = {
    search: {
        handler: (ctx, arg) => Commands.search(ctx, arg),
        triggers: ["search"].map(Utils.prefixify),
    },
    play: {
        handler: (ctx, arg) => Commands.play(ctx, arg),
        triggers: ["p", "play"].map(Utils.prefixify),
    },
    lofi: {
        handler: (ctx, arg) => Commands.lofi(ctx, arg),
        triggers: ["lofi"].map(Utils.prefixify),
    },
    restart: {
        handler: (ctx, _arg) => Commands.restart(ctx),
        triggers: ["restart"].map(Utils.prefixify),
    },
    pause: {
        handler: (ctx, _arg) => Commands.pause(ctx),
        triggers: ["pause", "stop"].map(Utils.prefixify),
    },
    nowplaying: {
        handler: (ctx, _arg) => Commands.showNp(ctx),
        triggers: ["np", "nowplaying"].map(Utils.prefixify),
    },
    skip: {
        handler: (ctx, _arg) => Commands.skip(ctx),
        triggers: ["s", "skip"].map(Utils.prefixify),
    },
    voteskip: {
        handler: (ctx, _arg) => Commands.voteSkip(ctx),
        triggers: ["voteskip", "vs"].map(Utils.prefixify),
    },
    queue: {
        handler: (ctx, _arg) => Commands.showQueue(ctx),
        triggers: ["q", "queue"].map(Utils.prefixify),
    },
    move: {
        handler: (ctx, arg) => Commands.move(ctx, arg),
        triggers: ["m", "move"].map(Utils.prefixify),
    },
    moverange: {
        handler: (ctx, arg) => Commands.moveRange(ctx, arg),
        triggers: ["mr", "moverange"].map(Utils.prefixify),
    },
    remove: {
        handler: (ctx, arg) => Commands.remove(ctx, arg),
        triggers: ["remove", "r"].map(Utils.prefixify),
    },
    removerange: {
        handler: (ctx, arg) => Commands.removeRange(ctx, arg),
        triggers: ["removerange", "rr"].map(Utils.prefixify),
    },
    keep: {
        handler: (ctx, arg) => Commands.keep(ctx, arg),
        triggers: ["keep", "k"].map(Utils.prefixify),
    },
    keeprange: {
        handler: (ctx, arg) => Commands.keepRange(ctx, arg),
        triggers: ["keeprange", "kr"].map(Utils.prefixify),
    },
    clear: {
        handler: (ctx, _arg) => Commands.clearQueue(ctx),
        triggers: ["clear", "clr"].map(Utils.prefixify),
    },
    skipto: {
        handler: (ctx, arg) => Commands.skipTo(ctx, arg),
        triggers: ["skipto"].map(Utils.prefixify),
    },
    playnow: {
        handler: (ctx, arg) => Commands.playNow(ctx, arg),
        triggers: ["playnow", "pn"].map(Utils.prefixify),
    },
    loop: {
        handler: (ctx, _arg) => Commands.toggleLoop(ctx),
        triggers: ["loop", "l"].map(Utils.prefixify),
    },
    loopq: {
        handler: (ctx, _arg) => Commands.toggleLoopQueue(ctx),
        triggers: ["loopq", "lq"].map(Utils.prefixify),
    },
    shutup: {
        handler: (ctx, _arg) => Commands.shutUp(ctx),
        triggers: ["stfu", "shutup"].map(Utils.prefixify),
    },
    speakagain: {
        handler: (ctx, _arg) => Commands.unShutUp(ctx),
        triggers: ["talk", "speak"].map(Utils.prefixify),
    },
    clean: {
        handler: (ctx, _arg) => Commands.cleanMessages(ctx),
        triggers: ["clean"].map(Utils.prefixify),
    },
    quit: {
        handler: (ctx, _arg) => Commands.quit(ctx),
        triggers: ["quit", "dc"].map(Utils.prefixify),
    },
    ["stash pop"]: {
        handler: (ctx, arg) => Commands.stashPop(ctx, arg),
        triggers: ["stash pop", "stash get"].map(Utils.prefixify),
    },
    ["stash push"]: {
        handler: (ctx, arg) => Commands.stashPush(ctx, arg),
        triggers: ["stash push", "stash add"].map(Utils.prefixify),
    },
    ["stash drop"]: {
        handler: (ctx, arg) => Commands.stashDrop(ctx, arg),
        triggers: ["stash drop"].map(Utils.prefixify),
    },
    ["stash view"]: {
        handler: (ctx, arg) => Commands.stashView(ctx, arg),
        triggers: ["stash view"].map(Utils.prefixify),
    },
};

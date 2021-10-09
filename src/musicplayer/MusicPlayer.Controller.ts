import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { GuildMember, Message } from "discord.js";
import { CommandRegistry } from "../commands/Command.Registry";
import { RecognizedCommands } from "../commands/RecognizedCommands";
import { configObj } from "../common/Config";
import * as Utils from "../common/Utils";
import { MusicPlayer } from "../models/MusicPlayer.Model";

export const commandController = async (ctx: MusicPlayer, message: Message) => {
    potentiallyRejoinVoice(ctx);
    const { cmd, arg } = parser(message.content);
    const delegation = delegator(message.member!, ctx, cmd, arg);
    if (delegation) {
        clearTimeout(ctx.idleTimer);
        delegation();
        if (configObj.autoDeleteAfter)
            setTimeout(
                () => message.delete().catch((noop) => noop),
                configObj.autoDeleteAfter * 1000
            );
    }
};

const potentiallyRejoinVoice = (ctx: MusicPlayer) => {
    const voiceCon = getVoiceConnection(ctx.guild.id);
    if (!voiceCon) return;
    const voiceStatus = voiceCon.state.status;
    if (voiceStatus === VoiceConnectionStatus.Disconnected) voiceCon.rejoin();
};

const delegator = (
    user: GuildMember,
    ctx: MusicPlayer,
    cmd: string,
    arg: string
) => {
    const command = findCommand(cmd);
    if (!command) return undefined;
    const [cmdName, { handler }] = command;
    return hasPermissions(ctx, user, cmdName as RecognizedCommands)
        ? () => handler(ctx, arg)
        : () => noPermission(ctx, user, cmd);
};

export const parser = (content: string) => {
    const parts = content.split(" ").map((str) => str.trim());

    const splitPoint = Object.values(CommandRegistry)
        .filter((cmd) => cmd.cmdTokens === 2)
        .flatMap((cmd) => cmd.triggers)
        .includes(parts.slice(0, 2).join(" ").toLowerCase())
        ? 2
        : 1;

    return {
        cmd: Utils.removeLinkMarkdown(
            parts.slice(0, splitPoint).join(" ")
        ).toLowerCase(),
        arg: Utils.removeLinkMarkdown(parts.slice(splitPoint).join(" ")),
    };
};

export const findCommand = (cmd: string) => {
    return Object.entries(CommandRegistry).find(([, command]) =>
        command.triggers.includes(cmd)
    );
};

export const musicCommandRecognizer = (content: string) =>
    !!findCommand(parser(content).cmd) ||
    content.trim() === Utils.prefixify("help") ||
    content.trim() === Utils.prefixify("ping");

const hasPermissions = (
    ctx: MusicPlayer,
    user: GuildMember,
    cmdName: RecognizedCommands
) => {
    // helper function
    const userHasRole = (user: GuildMember, role: string) =>
        user.roles.cache.some((userRole) => userRole.name === role);

    // if the command has not been restricted at all
    if (ctx.permissions[cmdName].length === 0) return true;

    // if the user is part of the exclusive list
    if (ctx.permissions[cmdName].some((role) => userHasRole(user, role)))
        return true;

    // at this stage, only way this command will be allowed is if allowUnattended = true
    // AND there is no one else in the voice channel with an exclusiveTo role.

    return (
        configObj.allowUnattended &&
        user.voice.channel!.members.some(
            (fellow) =>
                fellow.id !== user.id &&
                !fellow.user.bot && // ignore bots thereby ignoring JamBot itself.
                ctx.permissions[cmdName].some((role) =>
                    userHasRole(fellow, role)
                )
        )
    );
};

const noPermission = async (
    ctx: MusicPlayer,
    user: GuildMember,
    cmd: string
) => {
    ctx.messenger.send(
        user.toString() + " does not have permission for `" + cmd + "`"
    );
};

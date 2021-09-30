import { getVoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { GuildMember, Message } from "discord.js";
import { MusicPlayer } from "../models/MusicPlayer.model";

import { prefixify, removeLinkMarkdown } from "../common/Utils";
import { configObj } from "../common/Config";
import { RecognizedCommands } from "../registry/RecognizedCommands";
import { CommandRegistry } from "../registry/CommandRegistry";

export const controller = async (ctx: MusicPlayer, message: Message) => {
    potentiallyRejoinVoice(ctx);
    const { cmd, arg } = parser(message.content);
    const delegation = delegator(ctx, message.member!, cmd, arg);
    if (delegation) delegation();
};

const potentiallyRejoinVoice = (ctx: MusicPlayer) => {
    const voiceCon = getVoiceConnection(ctx.guild.id);
    if (!voiceCon) return;
    const voiceStatus = voiceCon.state.status;
    if (voiceStatus === VoiceConnectionStatus.Disconnected) voiceCon.rejoin();
};

const delegator = (
    ctx: MusicPlayer,
    user: GuildMember,
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
    const splitPoint = parts[0].toLowerCase() === prefixify("stash") ? 2 : 1;
    return {
        cmd: removeLinkMarkdown(
            parts.slice(0, splitPoint).join(" ")
        ).toLowerCase(),
        arg: removeLinkMarkdown(parts.slice(splitPoint).join(" ")),
    };
};

export const findCommand = (cmd: string) => {
    return Object.entries(CommandRegistry).find(([, command]) =>
        command.triggers.includes(cmd)
    );
};

export const musicCommandRecognizer = (content: string) =>
    !!findCommand(parser(content).cmd);

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

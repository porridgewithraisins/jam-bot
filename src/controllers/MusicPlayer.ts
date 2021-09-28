import { VoiceConnectionStatus } from "@discordjs/voice";
import { GuildMember, Message } from "discord.js";
import { MusicPlayer } from "../models/MusicPlayer";

import { prefixify, removeLinkMarkdown } from "../common/Utils";
import { configObj } from "../config/Config";
import { Command } from "../models/MusicPlayer";

export const controller = async (ctx: MusicPlayer, message: Message) => {
    if (ctx.voiceCon.state.status === VoiceConnectionStatus.Disconnected) {
        ctx.voiceCon.rejoin();
    }
    const { cmd, arg } = parser(message.content);
    const delegation = delegator(ctx, message.member!, cmd, arg);
    if (delegation) delegation();
};

const delegator = (
    ctx: MusicPlayer,
    user: GuildMember,
    cmd: string,
    arg: string
) => {
    const command = findCommand(ctx, cmd);
    return command
        ? hasPermissions(user, command)
            ? () => command.handler(ctx, arg)
            : () => noPermission(ctx, user, cmd)
        : undefined;
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

export const findCommand = (ctx : MusicPlayer, cmd: string) => {
    return Object.values(ctx.allCommands).find((command) =>
        command.triggers.includes(cmd)
    );
};

export const musicCommandRecognizer = (ctx : MusicPlayer, content: string) =>
    !!findCommand(ctx, parser(content).cmd);

const hasPermissions = (user: GuildMember, cmd: Command) => {
    // helper function
    const userHasRole = (user: GuildMember, role: string) =>
        user.roles.cache.some((userRole) => userRole.name === role);

    // if the command has not been restricted at all
    if (cmd.exclusiveTo!.length === 0) return true;

    // if the user is part of the exclusive list
    if (cmd.exclusiveTo!.some((role) => userHasRole(user, role))) return true;

    // at this stage, only way this command will be allowed is if allowUnattended = true
    // AND there is no one else in the voice channel with an exclusiveTo role.

    return (
        configObj.allowUnattended &&
        user.voice.channel!.members.some(
            (fellow) =>
                fellow.id !== user.id &&
                !fellow.user.bot && // ignore bots thereby ignoring JamBot itself.
                cmd.exclusiveTo!.some((role) => userHasRole(fellow, role))
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

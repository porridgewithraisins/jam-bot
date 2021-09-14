import { Intents } from "discord.js";

export const INTENTS = [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
];

export const READYEVENT = "ready";
export const MSGEVENT = "messageCreate";

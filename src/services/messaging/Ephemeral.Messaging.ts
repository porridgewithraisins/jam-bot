import { Message } from "discord.js";

export const makeEphemeral = async (
    awaitableMessage: Promise<Message> | undefined,
    timeout = 10_000
) => {
    if (!awaitableMessage) return;
    const msg = await awaitableMessage;
    if (!msg.deletable) return;
    setTimeout(async () => {
        try {
            await msg.delete();
        } catch (noop) {
            noop;
        }
    }, timeout);
    return msg;
};

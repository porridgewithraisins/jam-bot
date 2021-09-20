import { Client, Message, TextChannel } from "discord.js";

export { clean as deleteRecentMessagesBySelf };

const clean = async (message: Message, client: Client) => {
    if (!(message.channel instanceof TextChannel)) return;

    const filter = (msg: Message): boolean =>
        !!client.user && !!msg.member && client.user.id === msg.member.id;

    message.channel.send("Clearing messages...");

    const toDelete = message.channel.awaitMessages({
        filter,
        max: 100,
    });
    (await toDelete).forEach((message) => message.delete());
};

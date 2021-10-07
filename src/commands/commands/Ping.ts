import { Client, Message } from "discord.js";
import * as Utils from "../../common/Utils";
import { Messenger } from "../../services/Messaging";

export const ping = async (client: Client, message: Message) => {
    new Messenger(message).send(
        `🏓Latency is ${Utils.clampAtZero(
            Date.now() - message.createdTimestamp
        )}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
        undefined,
        { disappearAfter: 10_000 }
    );
};

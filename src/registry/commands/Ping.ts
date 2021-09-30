import { Client, Message } from "discord.js";
import { Messenger } from "../../services/Messaging";
import * as Utils from "../../common/Utils";

export const ping = async (client: Client, message: Message) => {
    new Messenger(message).send(
        `🏓Latency is ${Utils.clampAtZero(
            Date.now() - message.createdTimestamp
        )}ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
};

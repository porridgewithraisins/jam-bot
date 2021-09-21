import { Message } from "discord.js";
import * as Messaging from "./Messaging";
import { clampAtZero } from "./Utils";

export class Ping {
    execute(message: Message) {
        new Messaging.Messenger(message).send(
            `🏓Latency is ${clampAtZero(
                Date.now() - message.createdTimestamp
            )}ms`
        );
    }
}

import { Message } from "discord.js";
import * as Messaging from "./Messaging";

export class Ping {
    execute(message: Message) {
        Messaging.messenger(message, "Pong");
    }
}

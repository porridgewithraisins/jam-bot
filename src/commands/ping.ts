import { Message } from "discord.js";

export class Ping {
    execute(message: Message) {
        message.reply("Pong");
    }
}
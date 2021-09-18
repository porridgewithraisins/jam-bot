import { Message } from "discord.js";
import { embedMessage} from "./Message";

export class Ping {
    execute(message: Message) {
        message.channel.send(embedMessage("Pong"));
    }
}

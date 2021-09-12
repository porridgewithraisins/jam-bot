import { Message } from "discord.js";

export class Help {
    msg: string;

    constructor() {
        this.msg = "Commands:\n i'll do this tomorrow";
    }
    execute(message: Message) {
        message.channel.send(this.msg);
    }
}

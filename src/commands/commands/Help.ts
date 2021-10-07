import { Message } from "discord.js";
import { Messenger } from "../../services/Messaging";
import * as Views from "../../services/ViewExporter";

export const help = (message: Message) => {
    new Messenger(message).send([Views.helpView()], undefined, {
        disappearAfter: 10_000,
    });
};

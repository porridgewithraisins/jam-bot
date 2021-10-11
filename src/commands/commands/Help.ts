import { Message } from "discord.js";
import { Messenger } from "../../services/Messaging";
import * as Views from "../../views/ViewExporter";

export const help = (message: Message) => {
    new Messenger(message).send([Views.helpView()], undefined, {
        disappearAfter: 10_000,
    });
};

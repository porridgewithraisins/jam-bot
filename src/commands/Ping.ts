import * as discordJs from "discord.js";
import * as Messaging from "../services/interaction/Messaging";
import * as Utils from "../common/Utils";

export class Ping {
    execute(client: discordJs.Client, message: discordJs.Message) {
        new Messaging.Messenger(message).send(
            `🏓Latency is ${Utils.clampAtZero(
                Date.now() - message.createdTimestamp
            )}ms. API Latency is ${Math.round(client.ws.ping)}ms`
        );
    }
}

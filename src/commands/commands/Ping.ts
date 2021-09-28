import * as discordJs from "discord.js";
import * as Messaging from "../../services/Messaging";
import * as Utils from "../../common/Utils";

export const ping = async (
    client: discordJs.Client,
    message: discordJs.Message
) => {
    new Messaging.Messenger(message).send(
        `🏓Latency is ${Utils.clampAtZero(
            Date.now() - message.createdTimestamp
        )}ms. API Latency is ${Math.round(client.ws.ping)}ms`
    );
};

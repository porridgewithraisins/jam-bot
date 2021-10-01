import { Message } from "discord.js";
import { client } from "../models/Client.Model";
import * as Commands from "../commands/CommandExporter";
import * as Utils from "../common/Utils";
import { mainMiddleware } from "../middleware/Message.Middleware";
import { voiceMiddleware } from "../middleware/Voice.Middleware";
import { controller } from "../musicplayer/MusicPlayer.Controller";
import { getMusicPlayer } from "../musicplayer/MusicPlayer.Registry";
import * as Views from "../services/ViewExporter";

export const onMessage = async (message: Message) => {
    if (!mainMiddleware(message)) return;

    if (message.content === Utils.prefixify("ping")) {
        Commands.ping(client, message);
        return;
    }

    if (message.content.trim() === Utils.prefixify("help")) {
        message.reply({ embeds: [Views.helpView()] });
        return;
    }

    if (!voiceMiddleware(message)) return;
    const playerForThisGuild = getMusicPlayer(message);
    if (playerForThisGuild) controller(playerForThisGuild, message);
};

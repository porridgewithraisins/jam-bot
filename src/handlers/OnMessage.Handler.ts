import { Message } from "discord.js";
import * as Commands from "../commands/CommandExporter";
import * as Utils from "../common/Utils";
import { bot } from "../models/Bot.Model";
import { commandController } from "../musicplayer/MusicPlayer.Controller";
import { getMusicPlayerForGuild } from "../musicplayer/MusicPlayer.Registry";
import * as Views from "../services/ViewExporter";
import { messageValidator } from "../validators/Message.Validator";
import { voiceValidator } from "../validators/Voice.Validator";

export const onMessage = async (message: Message) => {
    if (!messageValidator(message)) return;

    if (message.content === Utils.prefixify("ping")) {
        Commands.ping(bot.client, message);
        return;
    }

    if (message.content.trim() === Utils.prefixify("help")) {
        message.reply({ embeds: [Views.helpView()] });
        return;
    }

    if (!voiceValidator(message)) return;
    const playerForThisGuild = getMusicPlayerForGuild(message);
    if (playerForThisGuild) commandController(playerForThisGuild, message);
};

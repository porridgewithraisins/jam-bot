import { AbortController } from "node-abort-controller";
import * as process from "process";
import { Config, configObj } from "./common/Config";
import { credentials } from "./common/Credentials";
import { bot } from "./models/Bot.Model";
import { periodicallyLogPerformance } from "./services/ResourceUsage";
import { configValidator } from "./validators/Config.Validator";

global.AbortController = AbortController;

export async function initializeBot(options: Config) {
    if (!(await configValidator(options))) {
        process.exit(1);
    }

    try {
        await bot.login(configObj.token);
    } catch (e: any) {
        console.error("Invalid bot token provided");
        process.exit(1);
    }

    credentials.startPeriodicallyRefreshingSpotifyAccessToken();

    if (configObj.periodicallyLogPerformance) periodicallyLogPerformance();

    bot.attachHandlers();
}

import * as process from "process";
import { client } from "./models/Client.Model";
import { Config, configObj } from "./common/Config";
import { onMessage } from "./handlers/onMessage.Handler";
import { onReady } from "./handlers/onReady.Handler";
import { configMiddleware } from "./middleware/Config.Middleware";

export function init(options: Config) {
    configMiddleware(options);
    if (configObj.periodicallyLogPerformance)
        setInterval(() => console.log(process.resourceUsage()), 15 * 60 * 1000);

    client.login(configObj.token);

    client.on("ready", onReady);

    client.on("messageCreate", onMessage);
}

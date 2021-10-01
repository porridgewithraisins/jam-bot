import { Config, configObj } from "../common/Config";
import { credentials } from "../common/Credentials";

export const configMiddleware = async (options: Config) => {
    try {
        configObj.load(options);
    } catch (e: any) {
        console.error("Configuration error:", e.message);
        process.exit(1);
    }
    if (configObj.spotify) {
        try {
            await credentials.refreshSpotifyAccessToken();
            credentials.startPeriodicallyRefreshingSpotifyAccessToken();
        } catch (e: any) {
            console.error(e.message);
            process.exit(1);
        }
    }
};

export const __FOR__TESTING__ = { configMiddleware };

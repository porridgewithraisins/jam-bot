import { Config, configObj } from "../common/Config";
import { credentials } from "../common/Credentials";

export const configValidator = async (options: Config) => {
    try {
        configObj.load(options);
    } catch (e: any) {
        console.error("Configuration Error:", e.message);
        return false;
    }
    if (configObj.spotify) {
        try {
            await credentials.refreshSpotifyAccessToken();
        } catch (e: any) {
            console.error("Credentials Error:", e.message);
            return false;
        }
    }
    return true;
};

export const __FOR__TESTING__ = { configValidator };

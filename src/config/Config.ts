import { MusicPlayer, RecognizedCommands } from "../models/MusicPlayer";

export class Config {
    token?: string;
    prefix: string = "!";
    spotify?: {
        clientId: string;
        clientSecret: string;
    };
    permissions: {
        [roleName: string]: RecognizedCommands[];
    } = {};
    allowUnattended = true;
    periodicallyLogPerformance = false;
    loaded = false;

    load(obj: any) {
        if (this.validate(obj)) {
            Object.assign(this, obj);
            this.loaded = true;
        }
    }

    validate(obj: any): obj is this {
        if (!obj.token) throw new Error("Token not provided");

        if (!obj.prefix?.trim())
            throw new Error(`Invalid prefix ${obj.prefix}`);

        if (
            obj.spotify &&
            !(obj.spotify.clientId && obj.spotify.clientSecret)
        ) {
            throw new Error("Spotify credentials missing");
        }

        if (!obj.permissions) return true;

        if (Array.isArray(obj.permissions))
            throw new Error("Invalid permissions");

        for (const [k, v] of Object.entries(obj.permissions)) {
            if (!(v instanceof Array))
                throw new Error("Invalid permission configuration");
            let wrongCommand;
            if (
                (wrongCommand = v.find(
                    (cmd) => !(cmd in MusicPlayer.MusicPlayerCommands)
                ))
            ) {
                throw new Error(
                    "Invalid command in permissions: " +
                        k +
                        " - " +
                        wrongCommand
                );
            }
        }
        return true;
    }
}

export const configObj = new Config();

export const __FOR__TESTING__ = { configObj, Config };

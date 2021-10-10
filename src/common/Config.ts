import EventEmitter from "events";
import {
    MusicPlayerCommands,
    RecognizedCommands,
} from "../commands/RecognizedCommands";

type Permissions = { [roleName: string]: RecognizedCommands[] };

export class Config extends EventEmitter {
    token: string = "";
    prefix: string = "!";
    spotify?: {
        clientId: string;
        clientSecret: string;
    };
    permissions: Permissions = {};
    allowUnattended = true;
    idleTimeout = 15;
    autoDeleteAfter?: number;
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

        for (const [role, commands] of Object.entries(obj.permissions)) {
            if (!(commands instanceof Array))
                throw new Error("Invalid permission configuration");
            let wrongCommand;
            if (
                (wrongCommand = commands.find(
                    (cmd) => !MusicPlayerCommands.includes(cmd)
                ))
            ) {
                throw new Error(
                    "Invalid command in permissions: " +
                        role +
                        " - " +
                        wrongCommand
                );
            }
        }
        if (obj.idleTimeout && isNaN(parseInt(obj.idleTimeout))) {
            throw new Error(
                "idleTimeout must be a number (You can leave it empty for a default of 15 seconds)"
            );
        }
        if (obj.autoDeleteAfter && isNaN(parseInt(obj.autoDeleteAfter))) {
            throw new Error(
                "autoDeleteAfter must be a number (You can leave it empty for a default of 15 seconds)"
            );
        }

        return true;
    }
}

export const configObj = new Config();

export const __FOR__TESTING__ = { configObj, Config };

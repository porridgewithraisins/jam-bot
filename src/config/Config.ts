import { RecognizedCommands } from "../commands/MusicPlayer";

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
        if (
            obj.spotify &&
            !(obj.spotify.clientId && obj.spotify.clientSecret)
        ) {
            throw new Error("Configuration error: Spotify details missing");
        }
        return true;
    }
}

export const configObj = new Config();

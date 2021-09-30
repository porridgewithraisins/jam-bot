import { configObj } from "../common/Config";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

class Credentials {
    spotifyAccessToken: string | undefined;
    soundCloudAPIKey: string | undefined;

    private async getSpotifyAccessToken(
        clientId: string,
        clientSecret: string
    ) {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${this.encodeSpotifyIDAndSecret(
                    clientId,
                    clientSecret
                )}`,
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });
        if (!response.ok) {
            throw new Error("Spotify auth failed");
        }
        const json = await response.json();
        return (json as { access_token: string }).access_token;
    }

    async refreshSpotifyAccessToken() {
        this.spotifyAccessToken = await this.getSpotifyAccessToken(
            configObj.spotify!.clientId,
            configObj.spotify!.clientSecret
        );
    }

    startPeriodicallyRefreshingSpotifyAccessToken() {
        setTimeout(this.refreshSpotifyAccessToken, 3600 * 1000);
    }

    private encodeSpotifyIDAndSecret(id: string, secret: string) {
        return Buffer.from(`${id}:${secret}`).toString("base64");
    }
}

export const credentials = new Credentials();

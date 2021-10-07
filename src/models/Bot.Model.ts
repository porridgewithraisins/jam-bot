import { Client } from "discord.js";
import { intents } from "../common/Intents";
import { onMessage } from "../handlers/OnMessage.Handler";
import { onReady } from "../handlers/OnReady.Handler";

class Bot {
    readonly client = new Client({ intents });
    private loggedIn = false;
    async login(token: string) {
        if (!this.loggedIn) {
            await this.client.login(token);
            console.log("Logged in successfully!");
            this.loggedIn = true;
        }
    }

    attachHandlers() {
        this.client.on("ready", onReady);
        this.client.on("messageCreate", onMessage);
    }
}

export const bot = new Bot();

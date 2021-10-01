import { Client } from "discord.js";

export const onReady = async (client: Client) => {
    try {
        await client.user?.setAvatar("assets/jambot.png");
    } catch (e) {}

    console.log("JamBot is ready to go!");
};

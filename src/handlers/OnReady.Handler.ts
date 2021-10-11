import { Client } from "discord.js";

export const onReady = async (client: Client) => {
    console.log(
        `JamBot [@${client.user?.tag ?? "deleted_user"}] is ready to jam!`
    );
    try {
        await client.user?.setAvatar("assets/jambot.png");
    } catch {
        console.log("Minor: Failed to set avatar");
    }
};

import { getVoiceConnection } from "@discordjs/voice";
import { MusicPlayer } from "../../models/MusicPlayer.Model";

export const quit = async (ctx: MusicPlayer) => {
    const con = getVoiceConnection(ctx.guild.id);
    if (con) {
        con.destroy();
        ctx.messenger.send("_Disconnecting..._");
    }
    ctx.onQuitCallback();
};

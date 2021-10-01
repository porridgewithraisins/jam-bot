import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { paginatedView } from "../../services/ViewExporter";

export const showQueue = async (ctx: MusicPlayer) => {
    if (ctx.songs.length) {
        ctx.messenger.paginate(paginatedView("Queue", ctx.songs));
    } else {
        ctx.messenger.send("There is nothing queued!");
    }
};

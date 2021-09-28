import { paginatedView } from "../../services/Views";
import { MusicPlayer } from "../../models/MusicPlayer";

export const showQueue = async (ctx: MusicPlayer) => {
    if (ctx.songs.length) {
        ctx.messenger.paginate(paginatedView("Queue", ctx.songs));
    } else {
        ctx.messenger.send("There is nothing queued!");
    }
};

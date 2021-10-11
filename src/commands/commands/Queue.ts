import { MusicPlayer } from "../../models/MusicPlayer.Model";
import * as Views from "../../views/ViewExporter";

export const showQueue = async (ctx: MusicPlayer) => {
    if (ctx.songs.length) {
        ctx.messenger.paginate(Views.paginatedView("Queue", ctx.songs));
    } else {
        ctx.messenger.send("There is nothing queued!");
    }
};

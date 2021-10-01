import { MusicPlayer } from "../../models/MusicPlayer.Model";
import { keywordSearch } from "../../services/Searcher";
import { paginatedView } from "../../services/ViewExporter";

export const search = async (ctx: MusicPlayer, arg: string) => {
    ctx.messenger.sendTyping();
    const searchResult = await keywordSearch(arg);
    if (!searchResult.length) {
        ctx.messenger.send(`No songs found matching your query ${arg}`);
        return;
    }

    [ctx.isInSearchFlow, ctx.searchResult] = [true, searchResult];

    ctx.messenger.paginate(
        paginatedView(`Search for '${arg}'`, ctx.searchResult)
    );
};

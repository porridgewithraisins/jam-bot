import * as Assets from "../../common/Assets";
import * as Utils from "../../common/Utils";
import { NowPlaying } from "../../models/NowPlaying.Model";
import * as Views from "../ViewExporter";

export const view = ({
    title,
    url,
    duration,
    elapsedTimer,
    thumbnail,
}: NowPlaying) =>
    Views.baseView()
        .setAuthor("Now Playing")
        .setTitle(Utils.coerceSize(title, 25))
        .setURL(url)
        .addField(
            "Elapsed",
            `${elapsedTimer.elapsed}/${Utils.padZeros(duration)}`
        )
        .setThumbnail(thumbnail || Assets.logoURL);

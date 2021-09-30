import * as Assets from "../../common/Assets";
import * as Utils from "../../common/Utils";
import { NowPlaying } from "../../models/Song";
import * as Base from "./Base";

export const view = ({
    title,
    url,
    duration,
    elapsedTimer,
    thumbnail,
}: NowPlaying) =>
    Base.view()
        .setAuthor("Now Playing")
        .setTitle(Utils.coerceSize(title, 25))
        .setURL(url)
        .addField(
            "Elapsed",
            `${elapsedTimer.elapsed}/${Utils.padZeros(duration)}`
        )
        .setThumbnail(thumbnail || Assets.logoURL);

import * as Assets from "../../common/Assets";
import * as Types from "../../common/Types";
import * as Utils from "../../common/Utils";
import * as Base from "./Base";

export const view = ({
    title,
    url,
    duration,
    elapsedTimer,
    thumbnail,
}: Types.NowPlaying) =>
    Base.view()
        .setAuthor("Now Playing")
        .setTitle(Utils.coerceSize(title, 25))
        .setURL(url)
        .addField(
            "Elapsed",
            `${elapsedTimer.elapsed}/${Utils.padZeros(duration)}`
        )
        .setThumbnail(thumbnail || Assets.logoURL);

import * as Assets from "../../common/Assets";
import * as Types from "../../common/Types";
import * as Utils from "../../common/Utils";
import * as Base from "./Base";

export const view = ({ title, url, thumbnail, artist }: Types.Song) =>
    Base.view()
        .setTitle(Utils.coerceSize(title, 25))
        .setAuthor("Added to queue")
        .setURL(url)
        .addField("Artist", Utils.removeTopicAtEnd(artist || "Unknown"), true)
        .setThumbnail(thumbnail || Assets.logoURL);

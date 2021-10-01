import * as Assets from "../../common/Assets";
import * as Utils from "../../common/Utils";
import { Song } from "../../models/Song.Model";
import * as Base from "./Base.View";

export const view = ({ title, url, thumbnail, artist }: Song) =>
    Base.view()
        .setTitle(Utils.coerceSize(title, 25))
        .setAuthor("Added to queue")
        .setURL(url)
        .addField("Artist", Utils.removeTopicAtEnd(artist || "Unknown"), true)
        .setThumbnail(thumbnail || Assets.logoURL);

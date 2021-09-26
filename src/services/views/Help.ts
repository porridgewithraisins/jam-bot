import * as Assets from "../../common/Assets";
import * as Base from "./Base";

export const view = (stash = false) =>
    Base.view()
        .setThumbnail(Assets.logoURL)
        .setFooter("JamBot")
        .setTitle("You can view the help text here")
        .setURL(Assets.commandHelpDocs + (stash ? "#stash" : ""));

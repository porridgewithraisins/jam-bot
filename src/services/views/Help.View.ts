import * as Assets from "../../common/Assets";
import * as Base from "./Base.View";

export const view = (stash = false) =>
    Base.view()
        .setTitle("You can view the help text here")
        .setURL(Assets.commandHelpDocs + (stash ? "#stash" : ""))
        .setFooter("Jambot", Assets.logoURL);

import * as Assets from "../../common/Assets";
import * as Views from "../ViewExporter";

export const view = (stash = false) =>
    Views.baseView()
        .setTitle("You can view the help text here")
        .setURL(Assets.commandHelpDocs + (stash ? "#stash" : ""));

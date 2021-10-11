import { MusicPlayer } from "../models/MusicPlayer.Model";
import { configObj } from "./Config";
import * as Commands from "../commands/CommandExporter";
export const configEditor = (ctx: MusicPlayer, arg: string) => {
    let [field, value] = arg.split(":");
    field = field.toLocaleLowerCase();
    if (
        !Object.keys(configObj)
            .map((key) => key.toLocaleLowerCase())
            .includes(field)
    ) {
        Commands.invalid(ctx);
        return;
    }
    if (field === "permissions") {
    }
};

// const permissionEditor = (ctx : MusicPlayer, role : string, )

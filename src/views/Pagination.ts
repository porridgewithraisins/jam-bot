import * as discordJs from "discord.js";
import * as Types from "../common/Types";
import * as Utils from "../common/Utils";
import * as Text from "./Text";

export const view = (title: string, songs: Types.Song[]) => {
    const embeds: discordJs.MessageEmbed[] = [];
    for (let i = 0; i < songs.length; i += 15) {
        embeds.push(
            Text.view(
                songs
                    .slice(i, i + 15)
                    .map(
                        (song, idx) =>
                            `${i + idx + 1}. ${Utils.mdHyperlinkSong(song)}`
                    )
                    .join("\n\n")
            ).setAuthor(title)
        );
    }
    return embeds;
};

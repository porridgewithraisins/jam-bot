import { MessageEmbed } from "discord.js";
import * as Utils from "../../common/Utils";
import { Song } from "../../models/Song.Model";
import * as Views from "../ViewExporter";

export const view = (title: string, songs: Song[]) => {
    const embeds: MessageEmbed[] = [];
    for (let i = 0; i < songs.length; i += 15) {
        embeds.push(
            Views.textView(
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

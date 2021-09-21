import { MessageEmbed } from "discord.js";
import { NowPlaying, Song } from "./Types";
import {
    mdHyperlinkSong,
    removeTopicAtEnd,
    coerceSize,
    padZeros,
} from "./Utils";

const baseEmbed = () => {
    return new MessageEmbed().setColor("#5e81ac");
};

export const textView = (text: string) => baseEmbed().setDescription(text);

export const songView = ({ title, url, thumbnail, artist }: Song) =>
    baseEmbed()
        .setTitle(coerceSize(title, 25))
        .setAuthor("Added to queue")
        .setURL(url)
        .addField("Artist", removeTopicAtEnd(artist || "Unknown"), true)
        .setThumbnail(thumbnail || "styled J");

export const nowPlayingView = ({
    title,
    url,
    duration,
    elapsedTimer,
    thumbnail,
}: NowPlaying) =>
    baseEmbed()
        .setAuthor("Now Playing")
        .setTitle(coerceSize(title, 25))
        .setURL(url)
        .addField(
            "Elapsed",
            `${elapsedTimer.elapsed}/${padZeros(duration)}`
        )
        .setThumbnail(thumbnail || "styled J");

export const paginatedListView = (title: string, songs: Song[]) => {
    const embeds: MessageEmbed[] = [];
    for (let i = 0; i < songs.length; i += 15) {
        embeds.push(
            textView(
                songs
                    .slice(i, i + 15)
                    .map(
                        (song, idx) =>
                            `${i + idx + 1}. ${mdHyperlinkSong(song)}`
                    )
                    .join("\n\n")
            ).setAuthor(title)
        );
    }
    return embeds;
};

import { MessageEmbed } from "discord.js";
import { MusicPlayerCommand, NowPlaying, Song } from "./Types";
import { removeTopicAtEnd } from "./Utils";

const baseEmbed = () => {
    return new MessageEmbed().setColor("#5e81ac");
};

export const textView = (text: string) => baseEmbed().setDescription(text);

export const songView = ({ title, url, thumbnail, artist }: Song) =>
    baseEmbed()
        .setTitle(title)
        .setURL(url)
        .addField("Artist", removeTopicAtEnd(artist || "Unknown"), true)
        .setAuthor("Now Playing")
        .setThumbnail(thumbnail || "styled J");

export const nowPlayingView = ({
    title,
    url,
    thumbnail,
    duration,
    artist,
    elapsedTimer,
}: NowPlaying) =>
    songView({ title, url, thumbnail, artist, duration }).addField(
        "Elapsed",
        `${elapsedTimer.elapsed}/${duration}`,
        true
    );

export const paginatedListView = (title: string, items: Song[]) => {};

export const helpView = (title: string, items: MusicPlayerCommand[]) => {};

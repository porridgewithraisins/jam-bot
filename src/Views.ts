import { MessageEmbed } from "discord.js";
import { MusicPlayerCommand, NowPlaying, Song } from "./Types";

const baseEmbed = () => {
    return new MessageEmbed().setColor("#5e81ac");
};

export const textView = (text: string) => baseEmbed().setDescription(text);

export const songView = ({ title, url, thumbnail, duration }: Song) =>
    baseEmbed()
        .setTitle(title)
        .setURL(url)
        .setImage(thumbnail || "styled J");

export const nowPlayingView = ({
    title,
    url,
    thumbnail,
    duration,
    elapsedTimer,
}: NowPlaying) =>
    songView({ title, url, thumbnail, duration }).addField(
        "Elapsed",
        `${elapsedTimer.elapsed}/${duration}`
    );


export const paginatedListView = (title : string, items : Song[]) => {

}

export const helpView = (title : string, items : MusicPlayerCommand[]) => {

}

import SpotifyWebApi from "spotify-web-api-node";
import { credentials } from "../../common/Credentials";
import * as Utils from "../../common/Utils";
import { Song } from "../../models/Song.Model";
import { getSongSource } from "../Fetcher";

const spotifyApi = new SpotifyWebApi();

const getPlaylist = async (id: string): Promise<Song[]> => {
    return (await spotifyApi.getPlaylistTracks(id)).body.items.map(
        ({
            track: {
                name: title,
                external_urls: { spotify: url },
                duration_ms,
                album: {
                    images: [{ url: thumbnail }],
                },
                artists: [{ name: artist }],
            },
        }) => ({
            title,
            url,
            duration: Utils.millisecToDuration(duration_ms),
            thumbnail,
            artist,
        })
    );
};

const getSong = async (id: string): Promise<Song[]> =>
    (({
        name: title,
        duration_ms,
        album: {
            images: [{ url: thumbnail }],
        },
        external_urls: { spotify: url },
        artists: [{ name: artist }],
    }: SpotifyApi.SingleTrackResponse): Song[] => [
        {
            title,
            duration: Utils.millisecToDuration(duration_ms),
            thumbnail,
            url,
            artist,
        },
    ])((await spotifyApi.getTrack(id)).body);

const getAlbum = async (id: string): Promise<Song[]> => {
    const res = (await spotifyApi.getAlbum(id)).body;
    const thumbnail = res.images[0].url;
    return res.tracks.items.map(
        ({
            name: title,
            duration_ms,
            external_urls: { spotify: url },
            artists: [{ name: artist }],
        }) => ({
            title,
            duration: Utils.millisecToDuration(duration_ms),
            url,
            thumbnail,
            artist,
        })
    );
};

const delegator = (arg: string): (() => Promise<Song[]>) => {
    spotifyApi.setAccessToken(credentials.spotifyAccessToken!);
    const { src, meta: id } = getSongSource(arg);
    if (src === "spotify") {
        return () => getSong(id!);
    }
    if (src === "spotify-album") {
        return () => getAlbum(id!);
    }
    if (src === "spotify-playlist") {
        return () => getPlaylist(id!);
    } else {
        throw new Error("Bad url passed to spotify fetcher");
    }
};

export const fetchFromSpotify = (arg: string) => delegator(arg)();

export const __FOR__TESTING__ = { fetchFromSpotify };

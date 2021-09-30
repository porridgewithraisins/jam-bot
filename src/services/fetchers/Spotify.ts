import SpotifyWebApi from "spotify-web-api-node";
import * as Utils from "../../common/Utils";
import { credentials } from "../../config/Credentials";
import { Song } from "../../models/Song";
import { getSongSource } from "../Fetcher";

const spotifyApi = new SpotifyWebApi();

const getPlaylist = async (id: string): Promise<Song[]> => {
    return (await spotifyApi.getPlaylistTracks(id)).body.items.map(
        ({
            track: {
                name,
                external_urls: { spotify },
                duration_ms,
                album: { images },
            },
        }) => ({
            title: name,
            url: spotify,
            duration: Utils.millisecToDuration(duration_ms),
            thumbnail: images[0].url,
        })
    );
};

const getSong = async (id: string): Promise<Song[]> => {
    return (({
        name,
        duration_ms,
        album: { images },
        external_urls: { spotify },
    }: SpotifyApi.SingleTrackResponse): Song[] => [
        {
            title: name,
            duration: Utils.millisecToDuration(duration_ms),
            thumbnail: images[0].url,
            url: spotify,
        },
    ])((await spotifyApi.getTrack(id)).body);
};

const getAlbum = async (id: string): Promise<Song[]> => {
    const res = (await spotifyApi.getAlbum(id)).body;
    const thumbnail = res.images[0].url;
    return res.tracks.items.map(
        ({ duration_ms, external_urls: { spotify }, name }) => ({
            title: name,
            duration: Utils.millisecToDuration(duration_ms),
            url: spotify,
            thumbnail,
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

export const __FOR__TESTING__ = { getPlaylist, getSong, getAlbum };

const { fetchFromSpotify } =
    require("../../../bin/services/fetchers/Spotify.Fetcher").__FOR__TESTING__;

const { credentials } =
    require("../../../bin/common/Credentials").__FOR__TESTING__;

jest.mock("../../../bin/common/Config", () => {
    return {
        configObj: {
            spotify: {
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            },
        },
    };
});

const nineTrackMindAlbum =
    "https://open.spotify.com/album/5Nwsra93UQYJ6xxcjcE10x?si=93b4a20808b14959";
const oopsGarrix = "https://open.spotify.com/track/1GbVo45KvYX3chroJggkIx";
const playlist = "https://open.spotify.com/playlist/5qYKmVPuW9C3L5rAYwww8e";

describe("test for spotify fetcher", () => {
    beforeAll(async () => await credentials.refreshSpotifyAccessToken());

    it("should fetch track information", () => {
        expect(fetchFromSpotify(oopsGarrix)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Oops",
                    url: "https://open.spotify.com/track/1GbVo45KvYX3chroJggkIx",
                    duration: "3:52",
                }),
            ])
        );
    });

    it("should fetch playlist information", () => {
        expect(fetchFromSpotify(playlist)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Super Trouper",
                    url: "https://open.spotify.com/track/2nMghZvtLx6DDgTEHEsb4w",
                    duration: "4:14",
                }),
            ])
        );
    });

    it("should fetch album information", () => {
        expect(fetchFromSpotify(nineTrackMindAlbum)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "One Call Away",
                    url: "https://open.spotify.com/track/37R0bQOQj5a7DOqh1TGzvB",
                    duration: "3:14",
                }),
            ])
        );
    });
}, 9999);

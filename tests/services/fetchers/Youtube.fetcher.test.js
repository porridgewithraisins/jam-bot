const { fetchFromYoutube } =
    require("../../../bin/services/fetchers/Youtube.Fetcher").__FOR__TESTING__;

const ytmusic7rings =
    "https://music.youtube.com/watch?v=XZ868t23Pb4&feature=share";

const youtubeSongInList =
    "https://www.youtube.com/watch?v=lAJazaLrHfQ&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_";

const youtubePlaylist =
    "https://www.youtube.com/playlist?list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_";

const shortUrl = "https://youtu.be/FwoJkxtmCjw";

const youtubePlain = "https://www.youtube.com/watch?v=68-LByyHfpc";

const liveStream = "https://www.youtube.com/watch?v=5qap5aO4i9A";

describe("Test for youtube fetcher", () => {
    it("should fetch song information from ytmusic", () => {
        expect(fetchFromYoutube(ytmusic7rings)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "7 rings",
                }),
            ])
        );
    });

    it("should fetch song information from song-in-lists", () => {
        expect(fetchFromYoutube(youtubeSongInList)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Dancing With Your Ghost",
                }),
            ])
        );
    });

    it("should fetch song information from playlists", () => {
        expect(fetchFromYoutube(youtubePlaylist)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ title: "Dancing With Your Ghost" }),
                expect.objectContaining({ title: "Paris" }),
                expect.objectContaining({ title: "Sunn Raha Hai" }),
            ])
        );
    });

    it("should fetch song from plain youtube URLs", () => {
        expect(fetchFromYoutube(youtubePlain)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "Little Do You Know",
                }),
            ])
        );
    });

    it("should fetch from short URLs", () => {
        expect(fetchFromYoutube(shortUrl)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    url: "https://www.youtube.com/watch?v=FwoJkxtmCjw",
                    artist: "Ed Sheeran",
                }),
            ])
        );
    });

    it("should set the isLive flag for live streams", () => {
        expect(fetchFromYoutube(liveStream)).resolves.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    isLive: true,
                }),
            ])
        );
    });
}, 9999);

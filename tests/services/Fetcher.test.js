const { getSongSource } =
    require("../../bin/services/Fetcher").__FOR__TESTING__;

describe("Test for getSongSource", () => {
    const mocks = {
        youtube: [
            "https://youtu.be/FwoJkxtmCjw",
            "https://www.youtube.com/watch?v=Slq9UPIqzD0",
            "https://www.youtube.com/watch?v=HiXx5JFRxb4&list=PL0dTqopwxGzRqAtF5bSwPxGJReVtLqHP_&index=3",
        ],
        "youtube-playlist": [
            "https://music.youtube.com/playlist?list=RDCLAK5uy_lBNUteBRencHzKelu5iDHwLF6mYqjL-JU&feature=share&playnext=1",
        ],
        spotify: [
            "https://open.spotify.com/track/37R0bQOQj5a7DOqh1TGzvB?si=4a53e22a830d44db",
        ],
        "spotify-playlist": [
            "https://open.spotify.com/playlist/5qYKmVPuW9C3L5rAYwww8e",
        ],
        "spotify-album": [
            "https://open.spotify.com/album/5Nwsra93UQYJ6xxcjcE10x?si=2cfba9dcf4414ee7",
        ],
    };

    it("should classify short youtube URLs correctly", () => {
        expect(getSongSource(mocks.youtube[0]).src).toStrictEqual("youtube");
    });

    it("should recognize normal youtube URLs", () => {
        expect(getSongSource(mocks.youtube[1]).src).toStrictEqual("youtube");
    });

    it("should classify video link from a playlist context correctly", () => {
        expect(getSongSource(mocks.youtube[1]).src).toStrictEqual("youtube");
    });

    it("should classify youtube playlist with other url params correctly", () => {
        expect(getSongSource(mocks["youtube-playlist"][0]).src).toStrictEqual(
            "youtube-playlist"
        );
    });

    it("should classify spotify track with other URl params correctly", () => {
        expect(getSongSource(mocks.spotify[0]).src).toStrictEqual("spotify");
    });

    it("should classify spotify playlist correctly", () => {
        expect(getSongSource(mocks["spotify-playlist"][0]).src).toStrictEqual(
            "spotify-playlist"
        );
    });

    it("should classify spotify album correctly", () => {
        expect(getSongSource(mocks["spotify-album"][0]).src).toStrictEqual(
            "spotify-album"
        );
    });
});

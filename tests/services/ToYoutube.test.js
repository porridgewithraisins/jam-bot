const { convertInfo } =
    require("../../bin/services/ToYoutube").__FOR__TESTING__;
const { validateURL } = require("ytdl-core-discord");

describe("to youtube converted", () => {
    const youtubeMock = {
        duration: "01:49",
        url: "https://www.youtube.com/watch?v=NghzSmmkhKY",
        title: "example.title.test",
        thumbnail: "https://example.thumbnail.test",
        artist: "example.artist.test",
    };

    const spotifyMock = {
        ...youtubeMock,
        url: "https://open.spotify.com/track/6FjbAnaPRPwiP3sciEYctO?si=94cf26a7dd9d4950",
    };

    const useFunc = (mock) => convertInfo(mock);

    test("does not touch youtube songs", async () => {
        const converted = await useFunc(youtubeMock);
        expect(converted).toStrictEqual(youtubeMock);
    });
    test("returns a youtube video for non youtube sources", async () => {
        const converted = await useFunc(spotifyMock);
        expect(validateURL(converted.url)).toBeTruthy();
    });

    // add soundcloud tests when soundcloud support
});

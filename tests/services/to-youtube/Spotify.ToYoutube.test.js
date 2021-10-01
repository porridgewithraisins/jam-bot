const spotifyToYoutube =
    require("../../../bin/services/to-youtube/Spotify.ToYoutube").__FOR__TESTING__;

const { validateURL } = require("ytdl-core-discord");

describe("spotify information to youtube song converter", () => {
    const mock = {
        duration: "01:49",
        url: "https://open.spotify.com/track/6FjbAnaPRPwiP3sciEYctO?si=94cf26a7dd9d4950",
        title: "Raabta",
        thumbnail: "https://example.thumbnail.test",
        artist: "Arijit Singh",
    };
    it("converts to youtube url", async () => {
        const yt = await spotifyToYoutube.convertSpotifyInfoToYoutube(mock);
        expect(validateURL(yt.url)).toBeTruthy();
    });
});

describe("spotify to youtube query strategies", () => {
    const mock = {
        title: "title",
        duration: "01:49",
        url: "https://u.rl",
        thumbnail: "https://thumb.nail",
    };

    it("when there is an artist name provided", () => {
        const strats = spotifyToYoutube.queryStrategies({
            ...mock,
            artist: "artist",
        });
        expect(strats).toStrictEqual([
            "title artist https://u.rl",
            "title artist",
        ]);
    });

    it("when no artist name is provided", () => {
        const strats = spotifyToYoutube.queryStrategies(mock);
        expect(strats).toStrictEqual(["title https://u.rl", "title"]);
    });
});

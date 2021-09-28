const subject = require("../../bin/config/Config").__FOR__TESTING__;

describe("configuration loading and validating tests", () => {
    const config = new subject.Config();

    const configWithoutToken = {
        prefix: "",
        spotify: {
            clientId: "hjhsudhsd",
            clientSecret: "hwidisjdis",
        },
    };
    const configWithSpotifyCredentialsMissing = {
        token: "hjshfuye7928eisds",
        prefix : ";;",
        spotify: {},
    };

    const configWithNoMentionOfSpotify = {
        token: "hhdhfjdhfjwsds",
        prefix: ";;",
        peridicallyLogPerformance: true,
    };

    const configWithEmptyPermissions = {
        token: "hujdyhufhudhfuisw",
        prefix: ";;",
        permissions: {},
    };

    const configWithEmptyRole = {
        token: "hidhfidhkfhcsjh",
        prefix: ";;",
        permissions: {
            DJ: [],
        },
    };

    it("should throw error when token is absent", () => {
        expect(() => config.load(configWithoutToken)).toThrow("Token not provided");
    });

    it("should throw error when spotify is mentioned but no credentials provided", () => {
        expect(() => config.load(configWithSpotifyCredentialsMissing)).toThrow(
            "Spotify credentials missing"
        );
    });
    it("should NOT throw an error when spotify is not even mentioned", () => {
        config.load(configWithNoMentionOfSpotify);
        expect(config).toBeDefined();
    });

    it("should NOT throw when permissions field is empty", () => {
        config.load(configWithEmptyPermissions);
        expect(config).toBeDefined();
    });

    it("should NOT throw when one or more roles have no permissions mentioned", () => {
        config.load(configWithEmptyRole);
        expect(config).toBeDefined();
    });
});

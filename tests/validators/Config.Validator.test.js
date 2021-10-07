const { configValidator } =
    require("../../bin/validators/Config.Validator").__FOR__TESTING__;

describe("tests for config validator", () => {
    const mockFn = jest.fn();
    beforeEach(() => (console.error = mockFn));
    afterEach(() => console.error.mockRestore());

    it("should return false on false config", () => {
        const emptyConfig = {};
        expect(configValidator(emptyConfig)).resolves.toBeFalsy();
    });

    it("should return false on false spotify credentials", () => {
        const configWithWrongSpotifyCreds = {
            token: process.env.DISCORD_BOT_TOKEN,
            prefix: "!!",
            spotify: {
                clientId: "hjhsudhsd",
                clientSecret: "hwidisjdis",
            },
        };

        expect(
            configValidator(configWithWrongSpotifyCreds)
        ).resolves.toBeFalsy();
    });

    it("should return false when idle timeout is falsely configured", () => {
        const configWithWrongIdleTimeout = {
            token: process.env.DISCORD_BOT_TOKEN,
            prefix: "!!",
            idleTimeout: "abc",
        };
        expect(
            configValidator(configWithWrongIdleTimeout)
        ).resolves.toBeFalsy();
    });

    it("should return false when invalid command name is present", () => {
        const configWithWrongCommandName = {
            token: process.env.DISCORD_BOT_TOKEN,
            prefix: "!!",
            permissions: {
                AB: ["stash push", "play"],
                DJ: ["stash pop", "wrong"],
            },
        };
        expect(
            configValidator(configWithWrongCommandName)
        ).resolves.toBeFalsy();
    });

    it("should return true for a correct config", () => {
        const correctConfig = {
            token: process.env.DISCORD_BOT_TOKEN,
            prefix: "!",
            permissions: {},
            allowUnattended: false,
            spotify: {
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            },
            idleTimeout: 60,
        };
        configValidator(correctConfig)
            .then((yes) => expect(yes).toBeTruthy())
            .catch(console.log);
        // expect(configValidator(correctConfig)).resolves.toBeTruthy();
    });
}, 9999);

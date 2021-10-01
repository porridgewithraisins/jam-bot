const { configMiddleware } =
    require("../../bin/middleware/Config.Middleware").__FOR__TESTING__;

describe("test if falsely loaded config exits the node process", () => {
    it("should quit on false config", () => {
        const mockExit = jest
            .spyOn(process, "exit")
            .mockImplementation(() => {});
        const emptyConfig = {};
        configMiddleware(emptyConfig);
        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
    });

    it("should quit on false credentials", () => {
        const mockExit = jest
            .spyOn(process, "exit")
            .mockImplementation(() => {});
        const wrongSpotifyCreds = {
            token: "abcdef",
            prefix: "!!",
            spotify: {
                clientId: "hjhsudhsd",
                clientSecret: "hwidisjdis",
            },
        };
        configMiddleware(wrongSpotifyCreds);
        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
    });
});

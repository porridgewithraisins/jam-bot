const { voiceValidator } =
    require("../../bin/validators/Voice.Validator").__FOR__TESTING;

describe("Tests for the voice validator", () => {
    jest.useFakeTimers();
    let deleteMock = jest.fn(async () => {});
    let replyMock = jest.fn(async () => ({ delete: deleteMock }));
    const mocks = {
        notInAVC: [
            {
                member: {
                    voice: {
                        channel: undefined,
                    },
                },
                reply: replyMock,
            },
            {
                member: {
                    voice: {
                        channel: null,
                    },
                },
                reply: replyMock,
            },
        ],
        stageChannel: [
            {
                member: {
                    voice: {
                        channel: {
                            type: "GUILD_STAGE_VOICE",
                        },
                    },
                },
                reply: replyMock,
            },
            {
                member: {
                    voice: {
                        channel: {
                            type: undefined,
                        },
                    },
                },
                reply: replyMock,
            },
        ],
        DM: {
            member: {
                voice: {
                    channel: { id: "accept" },
                },
            },

            channel: {
                type: "DM",
            },
            reply: replyMock,
        },
    };

    beforeEach(() => replyMock.mockClear());
    afterEach(() => jest.runAllTimers());
    it("should NOT validate if user is not in a voice channel", () => {
        mocks.notInAVC.forEach((mock) =>
            expect(voiceValidator(mock)).toBeFalsy()
        );
    });

    it("should reply to the message if user is not in a voice channel", () => {
        mocks.notInAVC.forEach(voiceValidator);
        expect(replyMock).toHaveBeenCalledTimes(2);
    });

    it("should delete the reply after a timeout", async () => {
        expect((await replyMock()).delete).toHaveBeenCalled();
    });

    it("should NOT validate if user is in a stage channel", () => {
        mocks.stageChannel.forEach((mock) =>
            expect(voiceValidator(mock)).toBeFalsy()
        );
    });

    it("should NOT validate if it is a DM", () => {
        expect(voiceValidator(mocks.DM)).toBeFalsy();
    });

    //add test for threadchannel once a mock is found for it
}, 9999);

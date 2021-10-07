const { voiceValidator } =
    require("../../bin/validators/Voice.Validator").__FOR__TESTING;

describe("Tests for the voice validator", () => {
    let flag = jest.fn();
    const mocks = {
        notInAVC: [
            {
                member: {
                    voice: {
                        channel: undefined,
                    },
                },
                reply: flag,
            },
            {
                member: {
                    voice: {
                        channel: null,
                    },
                },
                reply: flag,
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
                reply: flag,
            },
            {
                member: {
                    voice: {
                        channel: {
                            type: undefined,
                        },
                    },
                },
                reply: flag,
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
            reply: flag,
        },
    };

    beforeEach(() => flag.mockClear());

    it("should NOT validate if user is not in a voice channel", () => {
        mocks.notInAVC.forEach((mock) =>
            expect(voiceValidator(mock)).toBeFalsy()
        );
    });

    it("should reply to the message if user is not in a voice channel", () => {
        mocks.notInAVC.forEach(voiceValidator);
        expect(flag).toHaveBeenCalledTimes(2);
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

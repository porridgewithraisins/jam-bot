const { messageValidator } =
    require("../../bin/validators/Message.Validator").__FOR__TESTING__;

const mocks = {
    doesntStartWithPrefix: {
        content: "ignore this",
        author: {
            bot: false,
        },
    },
    botMessage: {
        content: "!valid",
        author: {
            bot: true,
        },
    },
    differentVoiceChannel: {
        content: "!valid",
        guild: {
            me: {
                voice: {
                    channel: {
                        id: "jambot",
                    },
                },
            },
        },
        member: {
            voice: {
                channel: {
                    id: "something else",
                },
            },
        },
        author: {
            bot: false,
        },
    },
    userGotKickedOut: {
        content: "!valid",
        guild: {
            me: {},
        },
        //member:
        author: {
            bot: false,
        },
    },

    sameVC: {
        content: "!valid",
        guild: {
            me: {
                voice: {
                    channel: {
                        id: "jambot",
                    },
                },
            },
        },
        member: {
            voice: {
                channel: {
                    id: "jambot",
                },
            },
        },
        author: {
            bot: false,
        },
    },

    userNotInAVC: {
        content: "!valid",
        member: {
            voice: undefined,
        },
        guild: {
            me: {
                voice: undefined,
            },
        },
        author: {
            bot: false,
        },
    },
    clientNotInAVC: {
        content: "!valid",
        member: {},
        guild: {
            me: {
                voice: undefined,
            },
        },
        author: {
            bot: false,
        },
    },
    notAGuild: {
        content: "!valid",
        guild: undefined,
        author: {
            bot: false,
        },
    },
};

describe("tests for message validator", () => {
    it("should NOT validate messages without a prefix", () => {
        expect(messageValidator(mocks.doesntStartWithPrefix)).toBeFalsy();
    });

    it("should validate users not in a voice channel", () => {
        // message middleware only allows ping and help, which don't
        // require a voice channel
        expect(messageValidator(mocks.userNotInAVC)).toBeTruthy();
    });

    it("should validate when client is not a voice channel", () => {
        expect(messageValidator(mocks.clientNotInAVC)).toBeTruthy();
    });

    it("should NOT validate when client and user are in different voice\
    channels", () => {
        expect(messageValidator(mocks.differentVoiceChannel)).toBeFalsy();
    });

    it("should NOT validate user that got kicked out during latency time", () => {
        expect(messageValidator(mocks.userGotKickedOut)).toBeFalsy();
    });

    it("should NOT validate bot messages", () => {
        expect(messageValidator(mocks.botMessage)).toBeFalsy();
    });

    it("should valite when user and client are in the same voice channel", () => {
        expect(messageValidator(mocks.sameVC)).toBeTruthy();
    });

    it("should not validate if its not a guild (it is a DM)", () => {
        expect(messageValidator(mocks.notAGuild)).toBeFalsy();
    });

}, 9999);

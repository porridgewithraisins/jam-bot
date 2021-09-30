const util = require("../../bin/common/Utils").__FOR__TESTING__;
const config = require("../../bin/common/Config").__FOR__TESTING__;

describe("test for removelinkMarkdown", () => {
    it("should remove link from markdown", () => {
        expect(util.removeLinkMarkdown("<https://test.url>")).toStrictEqual(
            "https://test.url"
        );
    });
    it("should not touch if only <", () => {
        expect(util.removeLinkMarkdown("<https://test.url")).toStrictEqual(
            "<https://test.url"
        );
    });
    it("should not touch if only >", () => {
        expect(util.removeLinkMarkdown("https://test.url>")).toStrictEqual(
            "https://test.url>"
        );
    });
    it("should not touch without any < or >", () => {
        expect(util.removeLinkMarkdown("https://test.url")).toStrictEqual(
            "https://test.url"
        );
    });
});

describe("Test for remove topic at end", () => {
    it("should remove - Topic at end", () => {
        expect(util.removeTopicAtEnd("Bruno Mars - Topic")).toStrictEqual(
            "Bruno Mars"
        );
    });
    it("Should not touch if no - Topic", () => {
        expect(util.removeTopicAtEnd("Bruno Mars")).toStrictEqual("Bruno Mars");
    });
});

describe("Test for prefixify", () => {
    it("should prefixify", () => {
        config.configObj.prefix = ";;";
        expect(util.prefixify("hjshdf")).toStrictEqual(";;hjshdf");
    });
});

describe("Test for markdown hyperlink song", () => {
    it("should hyperlink song", () => {
        const title = "Oops";
        const url = "https://ur.l";
        expect(util.mdHyperlinkSong({ title, url })).toStrictEqual(
            "[Oops](https://ur.l)"
        );
    });
});

describe("Test for duration to ms and ms to duration", () => {
    it("should convert mm:ss to ms and back", () => {
        const duration = "01:49";
        expect(util.durationToMs(duration)).toStrictEqual(109_000);
        expect(util.millisecToDuration(109_000)).toStrictEqual("1:49");
    });
    it("should convert hh:mm:ss to ms", () => {
        const duration = "03:08:49";
        expect(util.durationToMs(duration)).toStrictEqual(11_329_000);
        expect(util.millisecToDuration(11_329_000)).toStrictEqual("3:8:49");
    });
    it("should convert ss to ms", () => {
        const duration = "00:00:35";
        expect(util.durationToMs(duration)).toStrictEqual(35_000);
        expect(util.millisecToDuration(35_000)).toStrictEqual("0:35");
    });
});

describe("Test for clamp at zero", () => {
    it("should work for arg <= 0", () => {
        expect(util.clampAtZero(-Math.random() * 29)).toStrictEqual(0);
    });
    it("should work for x = 0", () => {
        expect(util.clampAtZero(0)).toStrictEqual(0);
    });
    it("should work for x > 0", () => {
        expect(util.clampAtZero(29)).toStrictEqual(29);
    });
});

describe("Test for mod", () => {
    it("positive number", () => {
        expect(util.mod(5, 3)).toStrictEqual(2);
    });
    it("negative number", () => {
        expect(util.mod(-4, 3)).toStrictEqual(2);
    });
});

describe("Test for coerceSize", () => {
    it("should trail with ... for large strings", () => {
        expect(
            util.coerceSize("Keane - Somewhere Only We Know", 25)
        ).toStrictEqual("Keane - Somewhere Only...");
    });
    it("should not touch perfectly sized strings", () => {
        expect(util.coerceSize("normal", 25)).toStrictEqual("normal");
    });
    // add test for smaller strings once invisible character found
});

describe("Test for padzeros", () => {
    it("should pad when single digit", () => {
        expect(util.padZeros("3:5:1")).toStrictEqual("03:05:01");
    });
    it("should not touch double digits", () => {
        expect(util.padZeros("04:5:34")).toStrictEqual("04:05:34");
    });
    it("should gracefully deal with NaN and not touch it", () => {
        expect(util.padZeros("abc:def:43")).toStrictEqual("abc:def:43");
    });
});

describe("Test for prepend http", () => {
    it("should not touch strings starting with http", () => {
        expect(util.prependHttp("http://u.rl")).toStrictEqual("http://u.rl");
    });
    it("should prepend https on other strings", () => {
        expect(util.prependHttp("http.u.rl")).toStrictEqual(
            "https://http.u.rl"
        );
    });
    it("should prepend http when https = false", () => {
        expect(util.prependHttp("http.u.rl", false)).toStrictEqual(
            "http://http.u.rl"
        );
    });
});

const { ElapsedTimer } = require("../../bin/services/Timer");

describe("test for timer", () => {
    afterEach(() => jest.useRealTimers());

    const useFunc = () => new ElapsedTimer("01:49");

    test("stops counting up at full time", () => {
        jest.useFakeTimers();
        const timer = useFunc();
        jest.runAllTimers();
        expect(timer.elapsed).toStrictEqual("01:49");
    });

    test("pauses counting up", () => {
        jest.useFakeTimers();
        const timer = useFunc();
        jest.advanceTimersByTime(20 * 1000);
        timer.stop();
        expect(timer.elapsed).toStrictEqual("00:20");
        setTimeout(() => {}, 20 * 1000);
        jest.runAllTimers();
        expect(timer.elapsed).toStrictEqual("00:20");
    });

    test("resumes counting up", () => {
        jest.useFakeTimers();
        const timer = useFunc();
        jest.advanceTimersByTime(20 * 1000);
        timer.stop();
        timer.start();
        jest.runAllTimers();
        expect(timer.elapsed).toStrictEqual("01:49");
    });

    test("does not count before 1 second has passed", () => {
        jest.useFakeTimers();
        const timer = useFunc();
        jest.advanceTimersByTime(500);
        expect(timer.elapsed).toStrictEqual("00:00");
    });

    test("counts when one second has passed", () => {
        jest.useFakeTimers();
        const timer = useFunc();
        jest.advanceTimersByTime(1000);
        expect(timer.elapsed).toStrictEqual("00:01");
    });
});

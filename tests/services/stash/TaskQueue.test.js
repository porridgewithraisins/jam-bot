const { TaskQueue } = require("../../../bin/services/stash/TaskQueue");

describe("Test for task queue", () => {
    const mock = (ms, obj) =>
        new Promise((resolve, reject) =>
            setTimeout(
                () => (obj instanceof Error ? reject(obj) : resolve(obj)),
                ms
            )
        );

    it("should resolve in the correct order", async () => {
        const taskQueue = new TaskQueue();
        const promises = [
            taskQueue.add(() => mock(1000, 1)),
            taskQueue.add(() => mock(200, 2)),
        ];
        expect(await Promise.all(promises)).toStrictEqual([1, 2]);
    });

    it("should propagate errors", () => {
        const taskQueue = new TaskQueue();
        expect(
            taskQueue.add(() => mock(1000, new Error("Can you catch me?")))
        ).rejects.toThrow("Can you catch me?");
    });

    it("should not block", async () => {
        const taskQueue = new TaskQueue();
        const mockFunction = jest.fn((x) => x);
        taskQueue.add(() => mock(1000, 1));
        mockFunction();
        expect(mockFunction).toHaveBeenCalled();
    });
    
    it("should have the overall correct order", async () => {
        const taskQueue = new TaskQueue();
        const order = [];
        const promises = [
            taskQueue.add(() =>
                mock(
                    1000,
                    "I should finish first even tho my setTimeout is 1000"
                )
            ),

            taskQueue
                .add(() => mock(1000, new Error("Can you catch me?")))
                .catch((e) => e.message),

            taskQueue.add(() =>
                mock(200, "I should finish last even tho my setTimeout is 200")
            ),
        ];

        expect(await Promise.all(promises)).toStrictEqual([
            "I should finish first even tho my setTimeout is 1000",
            "Can you catch me?",
            "I should finish last even tho my setTimeout is 200",
        ]);
    });
});

export class TaskQueue<Task extends CallableFunction> {
    private pending = Promise.resolve();
    private async run(task: Task) {
        try {
            await this.pending;
        } finally {
            return task();
        }
    }
    add(task: Task) {
        return (this.pending = this.run(task));
    }
}

// const mock = (ms: number, obj: any) =>
//     new Promise((res, rej) =>
//         setTimeout(() => (obj instanceof Error ? rej(obj) : res(obj)), ms)
//     );

// const q = new TaskQueue();

// q.add(() => mock(1000, "I should finish first even tho my setTimeout is 1000")).then(console.log);

// q.add(() => mock(1000, new Error("Can you catch me?")))
//     .then(console.log)
//     .catch((e: Error) => console.log("caught:", e.message));

// q.add(() => mock(200, "I should finish last even tho my setTimeout is 200")).then(console.log);

// console.log("This doesn't block");

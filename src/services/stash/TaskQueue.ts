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

export const __FOR__TESTING__ = { TaskQueue };

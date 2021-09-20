import { millisecToHhMmSs, padOneZero } from "./Utils";

export class ElapsedTimer {
    private elapsedMs = 0;
    private readonly interval = 1000;
    private timer: NodeJS.Timer | undefined;

    constructor() {
        this.play();
    }

    private update() {
        this.elapsedMs += this.interval;
    }

    pause() {
        if (this.timer) clearInterval(this.timer);
    }

    play() {
        this.timer = setInterval(() => this.update(), this.interval);
    }

    get elapsed() {
        return `${millisecToHhMmSs(this.elapsedMs)
            .map(padOneZero)
            .join(":")}`;
    }
}

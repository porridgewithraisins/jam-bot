import { durationToMs, millisecToHhMmSs, padOneZero } from "./Utils";

export class ElapsedTimer {
    private elapsedMs = 0;
    private readonly interval = 1000;
    private timer: NodeJS.Timer | undefined;
    private total = 0;
    constructor(duration: string) {
        this.play();
        this.total = durationToMs(duration);
    }

    private update() {
        this.elapsedMs += this.interval;
    }

    pause() {
        if (this.timer) clearInterval(this.timer);
    }

    play() {
        this.timer = setInterval(() => {
            if (this.elapsedMs >= this.total) this.pause();
            else this.update();
        }, this.interval);
    }

    get elapsed() {
        return `${millisecToHhMmSs(this.elapsedMs).map(padOneZero).join(":")}`;
    }
}

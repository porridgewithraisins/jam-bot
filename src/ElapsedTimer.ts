import { padOneZero } from "./Utils";

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
        let time = Math.floor(this.elapsedMs / 1000);
        const ss = time % 60;
        time /= 60;
        const mm = time % 60;
        time /= 60;
        const hh = time % 60;
        return `${(hh ? [hh, mm, ss] : [mm, ss]).map(padOneZero).join(":")}`;
    }
}

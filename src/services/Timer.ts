import * as Utils from "../common/Utils";

/**
 @class
 @description Runs a timer which counts up to duration, 
 with the ability to pause
 @argument duration hh:mm:ss form
 */

export class ElapsedTimer {
    private elapsedMs = 0;
    private readonly interval = 1000;
    private timer: NodeJS.Timer | undefined;
    private total = 0;
    constructor(duration: string) {
        this.total = Utils.durationToMs(duration);
        this.start();
    }

    get elapsed() {
        return Utils.padZeros(Utils.millisecToDuration(this.elapsedMs));
    }

    stop() {
        if (this.timer) clearInterval(this.timer);
    }

    start() {
        this.timer = setInterval(() => {
            if (this.elapsedMs >= this.total) this.stop();
            else this.update();
        }, this.interval);
    }

    private update() {
        this.elapsedMs += this.interval;
    }
}

export const __FOR__TESTING__ = {
    ElapsedTimer,
};

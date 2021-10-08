export const periodicallyLogPerformance = () => {
    const frequency = 15 * 60;
    console.log(
        `The bot will log resource usage once every ${frequency} seconds`
    );
    logPerformance();
    setInterval(logPerformance, frequency * 1000);
};

const logPerformance = () =>
    console.log(
        new Date().toLocaleString().slice(0, 18),
        process.resourceUsage()
    );

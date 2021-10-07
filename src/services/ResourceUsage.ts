export const periodicallyLogPerformance = () => {
    const frequency = 15 * 60;
    console.log(
        `The bot will log resource usage once every ${frequency} seconds`
    );
    setInterval(() => console.log(process.resourceUsage()), frequency * 1000);
};

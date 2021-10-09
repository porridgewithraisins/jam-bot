import latestVersion from "latest-version";
//@ts-ignore
import pkg = require("../../package.json");
export const checkForUpdates = async () => {
    const latest = await latestVersion(pkg.name);
    if (latest !== pkg.version) {
        console.log(
            "JamBot has updates available!, you can run `npm update` in your terminal to update it"
        );
    }
};

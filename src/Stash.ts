import fs, { constants } from "fs";
import path from "path";
import { Song } from "./Types";
const STASH_DIR = path.join(__dirname, "stash");

export { init, push, pop, drop, view };

const getFileForGuild = (guildId: string) =>
    path.join(STASH_DIR, guildId + ".json");

const fileExists = (path: string) =>
    fs.promises.stat(path).then(
        () => true,
        () => false
    );

const init = () => {
    try {
        fs.accessSync(__dirname, constants.R_OK | constants.W_OK);
        if (!fs.existsSync(STASH_DIR)) fs.mkdirSync(STASH_DIR);
        return true;
    } catch (e) {
        console.log(
            "Read and write permissions missing to create the storage folder"
        );
        console.error(e);
        return false;
    }
};

const push = (guildId: string, name: string, list: Song[]) => {
    const filePath = getFileForGuild(guildId);
    fs.readFile(filePath, (err, data) => {
        try {
            const stored = JSON.parse(data.toString());
            stored[name] = list;
            fs.writeFile(filePath, JSON.stringify(stored), (e) => {
                if (e) throw e;
            });
        } catch (e) {
            fs.writeFile(filePath, JSON.stringify({ [name]: list }), (e) => {
                if (e) throw e;
            });
        }
    });
    return undefined;
};

const pop = async (guildId: string, name: string) => {
    const filePath = getFileForGuild(guildId);
    if (await fileExists(filePath)) {
        const stored = JSON.parse(fs.readFileSync(filePath).toString());
        return stored[name];
    }
    else {
        return undefined;
    }
};

const drop = (guildId: string, name: string) => {
    const filePath = getFileForGuild(guildId);
    fs.readFile(filePath, (e, data) => {
        if (e) throw e;
        try {
            const stored = JSON.parse(data.toString());
            delete stored[name];
            fs.writeFile(filePath, JSON.stringify(stored), (e) => {
                if (e) throw e;
            });
        } catch (e) {}
    });
    return undefined;
};


const view = async (guildId : string, name ?: string) => {
    const filePath = getFileForGuild(guildId);
    if (await fileExists(filePath)) {
        const stored = JSON.parse(fs.readFileSync(filePath).toString());
        return name ? stored[name] : stored;
    } else {
        return undefined;
    }
}
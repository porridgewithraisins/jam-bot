import * as fs from "fs";
import * as fsp from "fs/promises";
import path from "path";
import { Song } from "../models/Song.Model";

/*JSON IS READ WITHOUT TYPE SAFETY, so be careful*/

const STASH_DIR = path.join(__dirname, "jambot-stashing-directory");

const getFileForGuild = (guildId: string) =>
    path.join(STASH_DIR, guildId + ".json");

export const init = () => {
    try {
        fs.accessSync(__dirname, fs.constants.R_OK | fs.constants.W_OK);

        if (!fs.existsSync(STASH_DIR)) {
            fs.mkdirSync(STASH_DIR);
        }
        return true;
    } catch (e) {
        console.log(
            "Read and write permissions missing to create the storage folder"
        );
        return false;
    }
};

export const push = async (guildId: string, name: string, list: Song[]) => {
    const filePath = getFileForGuild(guildId);
    try {
        const data = await fsp.readFile(filePath);
        const storedLists = JSON.parse(data.toString().trim() || "{}");
        storedLists[name] = list;
        await fsp.writeFile(filePath, JSON.stringify(storedLists));
    } catch (e) {
        await fsp.writeFile(filePath, JSON.stringify({ [name]: list }));
    }
};

export const pop = async (guildId: string, name: string) => {
    const filePath = getFileForGuild(guildId);
    try {
        const data = await fsp.readFile(filePath);
        const stored = JSON.parse(data.toString().trim() || "{}");
        return stored[name] as Song[];
    } catch (e) {
        return undefined;
    }
};

export const drop = async (guildId: string, name?: string) => {
    const filePath = getFileForGuild(guildId);
    try {
        const data = await fsp.readFile(filePath);
        let stored = JSON.parse(data.toString().trim() || "{}");
        if (!name) stored = {};
        else delete stored[name];
        await fsp.writeFile(filePath, JSON.stringify(stored));
    } catch (e) {
        return;
    }
};

export const view = async (guildId: string, name?: string) => {
    const filePath = getFileForGuild(guildId);
    try {
        const data = await fsp.readFile(filePath);
        const stored = JSON.parse(data.toString().trim() || "{}");
        return name
            ? (stored[name] as Song[])
            : (stored as Record<string, Song[]>);
    } catch (e) {
        return undefined;
    }
};

export const __FOR__TESTING__ = {
    getFileForGuild,
    init,
    push,
    pop,
    drop,
    view,
};

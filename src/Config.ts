import { Config } from "./Types";

let _config: Config;

export const getConfig = () => _config;
export const setConfig = (config: Config) => (_config = config);

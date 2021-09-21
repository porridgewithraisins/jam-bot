import * as Types from "../common/Types";

let _config: Types.Config;

export const getConfig = () => _config;
export const setConfig = (config: Types.Config) => (_config = config);

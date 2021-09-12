"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCmd = exports.getArg = void 0;
const getArg = (content) => content.split(" ").slice(1).join(" ");
exports.getArg = getArg;
const getCmd = (content) => content.split(" ")[0];
exports.getCmd = getCmd;

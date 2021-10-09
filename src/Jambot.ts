import { asciiArt } from "./common/Assets";
import { AbortController } from "node-abort-controller";
global.AbortController = AbortController;

console.log(asciiArt);

export { initializeBot as init } from "./InitBot";

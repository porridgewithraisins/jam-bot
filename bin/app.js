"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const queue_1 = require("./queue");
const utils_1 = require("./utils");
dotenv_1.default.config();
const token = process.env.TOKEN;
const prefix = "_";
const queueMap = new discord_js_1.Collection();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
client.login(token);
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () { return console.log("ready"); }));
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!message.content.startsWith(prefix) ||
        message.author.bot ||
        !message.guild)
        return;
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.voice.channel)) {
        message.reply("You need to be in a voice channel first");
        return;
    }
    if (!queueMap.has(message.guild.id))
        queueMap.set(message.guild.id, new queue_1.ServerQueue(message));
    const queue = queueMap.get(message.guild.id);
    const [cmd, arg] = [(0, utils_1.getCmd)(message.content), (0, utils_1.getArg)(message.content)];
    if (["_p", "_play"].includes(cmd)) {
        return queue.enq(arg);
    }
    if (["_s", "_skip"].includes(cmd)) {
        return queue.skip();
    }
    if (["_quit"].includes(cmd)) {
        return queue.quit();
    }
    if (["_q", "_queue"].includes(cmd)) {
        return queue.show();
    }
}));

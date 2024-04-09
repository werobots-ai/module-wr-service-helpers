"use strict";
// TODO: maybe initialize dotenv here
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEnv = void 0;
const requireEnv = (variableNames) => variableNames.reduce((acc, name) => {
    if (!process.env[name]) {
        throw new Error(`${name} is not set in env`);
    }
    acc[name] = process.env[name];
    return acc;
}, {});
exports.requireEnv = requireEnv;

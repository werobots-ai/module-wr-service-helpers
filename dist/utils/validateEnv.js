"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = void 0;
const validateEnv = (variableNames) => {
    variableNames.forEach((name) => {
        if (!process.env[name]) {
            throw new Error(`${name} is not set`);
        }
    });
};
exports.validateEnv = validateEnv;

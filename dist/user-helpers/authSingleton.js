"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSingleton = void 0;
const async_hooks_1 = require("async_hooks");
exports.authSingleton = new async_hooks_1.AsyncLocalStorage();
//

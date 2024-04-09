"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthData = void 0;
const authSingleton_js_1 = require("./authSingleton.js");
const getAuthData = () => authSingleton_js_1.authSingleton.getStore();
exports.getAuthData = getAuthData;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const generateUniqueId = (length = 24) => {
    // Generate a unique id of a given length
    // These IDs only contain lowercase letters and numbers, so they are safe to use in URLs and file names
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueId = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        uniqueId += chars[randomIndex];
    }
    return uniqueId;
};
exports.generateUniqueId = generateUniqueId;

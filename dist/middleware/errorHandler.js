"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(`API Error:`, {
        path: req.path,
        method: req.method,
        body: req.body,
    }, err);
    if (!err) {
        res.status(500).send("Internal Server Error");
        return;
    }
    if (err.status || err.statusCode) {
        res
            .status(err.status || err.statusCode)
            .send(`HTTP Error ${err.status || err.statusCode}: ${err.message || err}`);
        return;
    }
    if (err.message?.toLowerCase().includes("not found")) {
        res.status(404).send(err.message);
        return;
    }
    if (err.message?.toLowerCase().includes("unauthorized")) {
        res.status(401).send(err.message);
        return;
    }
    if (err.message?.toLowerCase().includes("forbidden")) {
        res.status(403).send(err.message);
        return;
    }
    if (/required|missing|invalid|bad request|validation/i.test(err.message)) {
        res.status(400).send(err.message);
        return;
    }
    res.status(500).send(`Internal Server Error: ${err.message} ${err.stack}`);
};
exports.errorHandler = errorHandler;

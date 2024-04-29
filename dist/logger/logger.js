"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    oldConsole;
    consolePatched = false;
    constructor() {
        this.oldConsole = { ...console };
    }
    argMapper(arg) {
        if (arg instanceof Error) {
            return `ERROR: { message: "${arg.message}", stack: "${arg.stack?.replace(/\n/g, "\\n")}" }`;
        }
        return arg;
    }
    init() {
        console.log("Initializing logger");
        this.patchConsole();
        this.catchNodeExceptions();
        console.log("Logger initialized");
    }
    patchConsole() {
        if (this.consolePatched)
            return;
        console.log = this.log.bind(this);
        console.error = this.error.bind(this);
        console.warn = this.warn.bind(this);
        this.consolePatched = true;
    }
    catchNodeExceptions() {
        process.on("uncaughtException", (error) => {
            this.error("!!! UNCAUGHT EXCEPTION !!!", error);
        });
        process.on("unhandledRejection", (error) => {
            this.error("!!! UNHANDLED REJECTION !!!", error);
        });
    }
    log(...args) {
        this.oldConsole.log(`INFO: `, ...args.map(this.argMapper));
    }
    error(...args) {
        this.oldConsole.error(`ERROR: `, ...args.map(this.argMapper));
    }
    warn(...args) {
        this.oldConsole.warn(`WARN: `, ...args.map(this.argMapper));
    }
    info(...args) {
        this.oldConsole.info(`INFO: `, ...args.map(this.argMapper));
    }
    debug(...args) {
        this.oldConsole.debug(`DEBUG: `, ...args.map(this.argMapper));
    }
    trace(...args) {
        this.oldConsole.trace(`TRACE: `, ...args.map(this.argMapper));
    }
}
exports.logger = new Logger();

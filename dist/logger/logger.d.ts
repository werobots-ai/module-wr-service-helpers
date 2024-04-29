declare class Logger {
    private oldConsole;
    private consolePatched;
    constructor();
    private argMapper;
    init(): void;
    patchConsole(): void;
    catchNodeExceptions(): void;
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    debug(...args: any[]): void;
    trace(...args: any[]): void;
}
export declare const logger: Logger;
export {};

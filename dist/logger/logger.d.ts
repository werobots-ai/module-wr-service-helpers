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
}
export declare const logger: Logger;
export {};

class Logger {
  private oldConsole: any;
  private consolePatched: boolean = false;

  constructor() {
    this.oldConsole = { ...console };
  }

  private argMapper(arg: any) {
    if (arg instanceof Error) {
      return `ERROR: { message: "${arg.message}", stack: "${arg.stack?.replace(
        /\n/g,
        "\\n"
      )}" }`;
    }

    return arg;
  }

  public init() {
    console.log("Initializing logger");
    this.patchConsole();
    this.catchNodeExceptions();
    console.log("Logger initialized");
  }

  public patchConsole() {
    if (this.consolePatched) return;

    console.log = this.log.bind(this);
    console.error = this.error.bind(this);
    console.warn = this.warn.bind(this);

    this.consolePatched = true;
  }

  public catchNodeExceptions() {
    process.on("uncaughtException", (error: Error) => {
      this.error("Uncaught exception", error);
    });

    process.on("unhandledRejection", (error: Error) => {
      this.error("Unhandled rejection", error);
    });
  }

  public log(...args: any[]) {
    this.oldConsole.log(`INFO: `, ...args.map(this.argMapper));
  }

  public error(...args: any[]) {
    this.oldConsole.error(`ERROR: `, ...args.map(this.argMapper));
  }

  public warn(...args: any[]) {
    this.oldConsole.warn(`WARN: `, ...args.map(this.argMapper));
  }
}

export const logger = new Logger();

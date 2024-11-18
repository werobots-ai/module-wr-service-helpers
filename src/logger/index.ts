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
    // console.log("Initializing logger");

    this.patchConsole();
    this.catchNodeExceptions();

    // console.log("Logger initialized"); // this will log "INFO: Logger initialized"
  }

  public patchConsole() {
    if (this.consolePatched) return;

    console.log = this.log.bind(this);
    console.info = this.info.bind(this);
    console.warn = this.warn.bind(this);
    console.debug = this.debug.bind(this);
    console.trace = this.trace.bind(this);
    console.error = this.error.bind(this);

    this.consolePatched = true;
  }

  public catchNodeExceptions() {
    process.on("uncaughtException", (error: Error) => {
      this.error("!!! UNCAUGHT EXCEPTION !!!", error);

      // we need to exit the process, otherwise it will keep running
      process.exit(1);
    });

    process.on("unhandledRejection", (error: Error) => {
      this.error("!!! UNHANDLED REJECTION !!!", error);

      // we need to exit the process, otherwise it will keep running
      process.exit(1);
    });
  }

  public log(...args: any[]) {
    this.oldConsole.log(`LOG: `, ...args.map(this.argMapper));
  }

  public info(...args: any[]) {
    this.oldConsole.info(`INFO: `, ...args.map(this.argMapper));
  }

  public warn(...args: any[]) {
    this.oldConsole.warn(`WARN: `, ...args.map(this.argMapper));
  }

  public debug(...args: any[]) {
    this.oldConsole.debug(`DEBUG: `, ...args.map(this.argMapper));
  }

  public trace(...args: any[]) {
    this.oldConsole.trace(`TRACE: `, ...args.map(this.argMapper));
  }

  public error(...args: any[]) {
    this.oldConsole.error(`ERROR: `, ...args.map(this.argMapper));
  }
}

export const logger = new Logger();

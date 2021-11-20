abstract class Logger {
  abstract notice(...textArr: any[]): void;
  abstract info(...textArr: any[]): void;
  abstract warn(...textArr: any[]): void;
  abstract error(...textArr: any[]): void;
  abstract estack(err: any): void;
  abstract wstack(err: any): void;
}

export { Logger };

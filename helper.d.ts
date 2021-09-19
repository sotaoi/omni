import _ from 'lodash';

type TransformerFn = (
  item: any,
  prefix: string,
  iterate: (item: any, prefix: string, transformer: TransformerFn, prop: string) => any,
  prop: string,
) => any;

type TransformerAsyncFn = (
  item: any,
  prefix: string,
  iterate: (item: any, prefix: string, transformer: TransformerFn, prop: string) => any,
  prop: string,
) => Promise<any>;

interface BundleJson {
  installed: boolean;
  master: boolean;
  [key: string]: any;
}

interface FileInfo {
  dir: string;
  filename: string;
  fullpath: string;
  extension: string;
  isDir: boolean;
  isFile: boolean;
}

class Helper {
  public static initialBundleJson(): BundleJson;

  public static async pause(milliseconds: number): Promise<void>;

  public static clone<ObjectType>(object: ObjectType): ObjectType;

  public static flatten(obj: { [key: string]: any }, prefix = ''): { [key: string]: any };

  public static unflatten(obj: { [key: string]: any }): { [key: string]: any };

  public static iterate(obj: { [key: string]: any }, stack: string, transformer: TransformerFn): any;

  public static async iterateAsync(
    obj: { [key: string]: any },
    stack: string,
    transformer: TransformerAsyncFn,
  ): Promise<any>;

  public static isJson(str: string): boolean;

  public static camelizeKebab(str: string): string;

  public static getTimestamp(): string;

  public static addSeconds(date: Date, seconds: number): Date;
  public static subtractSeconds(date: Date, seconds: number): Date;

  public static addDays(date: Date, days: number): Date;
  public static subtractDays(date: Date, days: number): Date;

  public static trim(charlist: string, str: string);

  // ltrim and rtrim are broken
  public static ltrim(charlist: string, str: string);
  public static rtrim(charlist: string, str: string);

  public static asset(item: null | string | { [key: string]: any }, role = 'assets'): null | string;

  //

  public static copyRecursiveSync(fs: any, path: any, src: string, dest: string, exclude: string[] = []): void;

  public static iterateRecursiveSync(
    fs: any,
    path: any,
    src: string,
    callback: (item: string) => void,
    exclude: string[] = [],
  ): void;

  public static readdirSyncRecur(
    fs: any,
    path: any,
    dir: string,
    exclude: string[] = [],
    files: FileInfo[] = [],
  ): FileInfo[];
}

export { Helper };
export type { TransformerFn, BundleJson };

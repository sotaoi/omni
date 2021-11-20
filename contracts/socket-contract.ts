type SocketListener =
  | ((msg: undefined | null | number | string | { [key: string]: any }) => Promise<any>)
  | ((msg: undefined | null | number | string | { [key: string]: any }) => any);

interface SocketOptions {
  [key: string]: any;
  transports: string[];
}

interface SocketClass {
  [key: string]: any;
  on(event: string, callback: SocketListener): void;
}

abstract class SocketContract {
  abstract connect(url: string, options: SocketOptions): SocketClass;
  abstract io(): SocketClass;
}

export { SocketContract };
export type { SocketListener, SocketOptions, SocketClass };

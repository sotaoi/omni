declare class SignalContract {
  public uid = null;
  public packageJson = null;

  constructor(
    packageJson: { [key: string]: any },
    install: (argv: any) => Promise<any>,
    prepare: (argv: any) => Promise<any>,
    load: (argv: any) => Promise<any>,
    bootstrap: (argv: any) => Promise<any>,
    config: (argv: any) => Promise<any>,
    setup: (argv: any) => Promise<any>,
    init: (argv: any) => Promise<any>,
  );

  console(argSlice?: null | string[]): this;

  command(
    signature: string,
    description: string,
    positional: (yargs: any) => any,
    handler: (argv: { [key: string]: string }) => Promise<any>,
  ): this;

  run(argSlice = null): this;

  validateCommand(command): boolean;

  install(argv): Promise<any>;

  prepare(argv): Promise<any>;

  load(argv): Promise<any>;

  bootstrap(argv): Promise<any>;

  config(argv): Promise<any>;

  setup(argv): Promise<any>;

  init(argv): Promise<any>;
}

export { SignalContract };

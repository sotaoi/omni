let uid = -1;
const privatesc = {};
const yargs = require('yargs');

class SignalContract {
  uid = null;
  packageJson = null;

  constructor(
    packageJson,
    {
      integrity = null,
      install = null,
      prepare = null,
      load = null,
      bootstrap = null,
      config = null,
      setup = null,
      init = null,
    },
  ) {
    if (typeof packageJson !== 'object' || !Object.keys(packageJson) || !packageJson.name || !packageJson.version) {
      throw new Error('Signal contract is broken: bad package.json');
    }
    if (
      !this.validateCommand(integrity) ||
      !this.validateCommand(install) ||
      !this.validateCommand(prepare) ||
      !this.validateCommand(load) ||
      !this.validateCommand(bootstrap) ||
      !this.validateCommand(config) ||
      !this.validateCommand(setup) ||
      !this.validateCommand(init)
    ) {
      throw new Error('Signal contract is broken: bad core commands');
    }
    uid++;
    this.uid = uid;

    privatesc[this.uid] = {
      integrity,
      install,
      prepare,
      load,
      bootstrap,
      config,
      setup,
      init,
      yargs: null,
    };

    this.packageJson = packageJson;
  }

  console(argSlice = process.argv.slice(2)) {
    privatesc[this.uid].yargs = yargs(argSlice)
      .scriptName('./signal')
      .command(
        'version',
        '-->  Show the app version',
        (yargs) => {
          return yargs;
        },
        async (argv) => {
          await privatesc[this.uid].integrity(argv);

          console.info(`App version is "${this.packageJson.version}"`);
        },
      );
    return this;
  }

  command(signature, description, positional, handler) {
    typeof description === 'number' && (description = description.toString());
    typeof description !== 'string' && (description = 'Missing description...');
    description = '-->  ' + description;
    typeof positional !== 'function' && (positional = () => null);
    privatesc[this.uid].yargs = privatesc[this.uid].yargs.command(signature, description, positional, handler);
    return this;
  }

  run() {
    privatesc[this.uid].yargs
      .command(
        'install',
        '-->  Missing description',
        () => null,
        (argv) => this.install(argv),
      )
      .command(
        'prepare',
        '-->  Missing description',
        () => null,
        (argv) => this.prepare(argv),
      )
      .command(
        'load',
        '-->  Missing description',
        () => null,
        (argv) => this.load(argv),
      )
      .command(
        'bootstrap',
        '-->  Missing description',
        () => null,
        (argv) => this.bootstrap(argv),
      )
      .command(
        'config',
        '-->  Missing description',
        () => null,
        (argv) => this.config(argv),
      )
      .command(
        'setup',
        '-->  Missing description',
        () => null,
        (argv) => this.setup(argv),
      )
      .command(
        'init',
        '-->  Missing description',
        () => null,
        (argv) => this.init(argv),
      )
      .strictCommands()
      .version(this.packageJson.version)
      .help()
      .alias('help', 'h').argv;
    return this;
  }

  validateCommand(command) {
    return typeof command === 'function';
  }

  install(argv) {
    return privatesc[this.uid].install(argv);
  }

  prepare(argv) {
    return privatesc[this.uid].prepare(argv);
  }

  load(argv) {
    return privatesc[this.uid].load(argv);
  }

  bootstrap(argv) {
    return privatesc[this.uid].bootstrap(argv);
  }

  config(argv) {
    return privatesc[this.uid].config(argv);
  }

  setup(argv) {
    return privatesc[this.uid].setup(argv);
  }

  init(argv) {
    return privatesc[this.uid].init(argv);
  }
}

module.exports = { SignalContract };

#!/usr/bin/env node

const { SignalContract } = require('@sotaoi/omni/contracts/signal-contract');
const { execSync } = require('child_process');
const path = require('path');

const main = async () => {
  class Signal extends SignalContract {
    //
  }

  new Signal(require('../package.json'), {
    ...require('./core'),
  })
    .console()
    .command('clean:bootstrap', null, null, () => {
      execSync(`node ./console/commands/clean/clean-bootstrap`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('clean:somni', null, null, () => {
      execSync(`node ./console/commands/clean/clean-somni`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .command('deploy:somni', null, null, () => {
      execSync(`node ./console/commands/deploy/deploy-somni`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .run();
};

main();

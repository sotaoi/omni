#!/usr/bin/env node

const { SignalContract } = require('@sotaoi/signal');
const { execSync } = require('child_process');
const path = require('path');

const main = async () => {
  const signalCore = require('./core');

  await signalCore.integrity();

  class Signal extends SignalContract {
    //
  }

  new Signal(require('../package.json'), {
    ...signalCore,
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
    .command('publish:somni', null, null, () => {
      execSync(`node ./console/commands/deploy/deploy-somni`, { cwd: path.resolve('./'), stdio: 'inherit' });
      execSync(`npm publish --access public`, { cwd: path.resolve('./deployment'), stdio: 'inherit' });
      execSync(`node ./console/commands/clean/clean-somni`, { cwd: path.resolve('./'), stdio: 'inherit' });
    })
    .run();
};

main();

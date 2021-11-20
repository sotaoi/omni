const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const integrity = async () => {
  if (fs.existsSync(path.resolve('./node_modules/@sotaoi/omni'))) {
    return;
  }
  execSync(`npm install --no-optional --legacy-peer-deps --force --no-audit --no-fund  --loglevel error`, {
    cwd: path.resolve('./'),
    stdio: 'inherit',
  });
};

const install = async () => {
  console.log('Signal installing @sotaoi/omni...');
  execSync(`npm install --no-optional --legacy-peer-deps --force --no-audit --no-fund  --loglevel error`, {
    cwd: path.resolve('./'),
    stdio: 'inherit',
  });
  console.log('Signal @sotaoi/omni install done!');
};

const prepare = async () => {
  // do nothing
};

const load = async () => {
  // do nothing
};

const bootstrap = async () => {
  // do nothing
};

const config = async () => {
  // do nothing
};

const setup = async () => {
  // do nothing
};

const init = async () => {
  // do nothing
};

module.exports = { integrity, install, prepare, load, bootstrap, config, setup, init };
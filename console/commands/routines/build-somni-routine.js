const fs = require('fs');
const path = require('path');
const { Helper } = require('@sotaoi/omni/helper');
const { execSync } = require('child_process');

const buildSomniRoutine = async () => {
  //

  fs.rmdirSync(path.resolve('./deployment'), { recursive: true });
  fs.mkdirSync(path.resolve('./deployment'));
  fs.writeFileSync(path.resolve('./deployment/.gitkeep'), '');

  const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString());

  Helper.copyRecursiveSync(fs, path, path.resolve('./'), path.resolve('./deployment'), [
    path.resolve('.git'),
    path.resolve('./deployment'),
    path.resolve('./node_modules'),
    path.resolve('./package-lock.json'),
  ]);

  delete packageJson.devDependencies;
  fs.writeFileSync(path.resolve('./deployment/package.json'), JSON.stringify(packageJson, null, 2));

  execSync('npx tsc', { cwd: path.resolve('./deployment'), stdio: 'inherit' });
  fs.unlinkSync(path.resolve('./deployment/tsconfig.json'));
  execSync('bash ./signal install', { cwd: path.resolve('./deployment'), stdio: 'inherit' });

  Helper.iterateRecursiveSync(
    fs,
    path,
    path.resolve('./deployment'),
    (item) => {
      if (fs.lstatSync(item).isDirectory()) {
        return;
      }
      item = path.resolve(item);
      if (item.substr(-3) === '.ts' && item.substr(-5) !== '.d.ts') {
        const filename = item.substr(0, item.length - 3);
        fs.existsSync(`${filename}.ts`) &&
          fs.lstatSync(`${filename}.ts`).isFile() &&
          fs.existsSync(`${filename}.js`) &&
          fs.lstatSync(`${filename}.js`).isFile() &&
          fs.existsSync(`${filename}.d.ts`) &&
          fs.lstatSync(`${filename}.d.ts`).isFile() &&
          fs.unlinkSync(item);
      }
      item.substr(-4) === '.tsx' && fs.unlinkSync(item);
    },
    [path.resolve('./deployment/node_modules')],
  );

  //
};

module.exports = { buildSomniRoutine };

const _ = require('lodash');

class Helper {
  static isConsole() {
    return !!(
      typeof process === 'object' &&
      typeof process.versions === 'object' &&
      typeof process.versions.node !== 'undefined' &&
      typeof process.env === 'object'
    );
  }

  static initialBundleJson() {
    return {
      installed: false,
      master: false,
    };
  }

  static async pause(milliseconds) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  static clone(object) {
    return _.cloneDeep(object);
  }

  static flatten(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && Object.keys(obj[k]).length > 0) {
        Object.assign(acc, this.flatten(obj[k], pre + k));
        return acc;
      }
      acc[pre + k] = obj[k];
      return acc;
    }, {});
  }

  static unflatten(obj) {
    return Object.keys(obj).reduce((res, k) => {
      k.split('.').reduce(
        (acc, e, i, keys) =>
          acc[e] || (acc[e] = isNaN(Number(keys[i + 1])) ? (keys.length - 1 === i ? obj[k] : {}) : []),
        res
      );
      return res;
    }, {});
  }

  static iterate(obj, stack, transformer) {
    if (typeof obj !== 'object') {
      return obj;
    }
    for (const prop of Object.keys(obj)) {
      obj[prop] = transformer(obj[prop], stack, transformer, prop);
    }
    return obj;
  }

  static async iterateAsync(obj, stack, transformer) {
    if (typeof obj !== 'object') {
      return obj;
    }
    for (const prop of Object.keys(obj)) {
      obj[prop] = await transformer(obj[prop], stack, transformer, prop);
    }
    return obj;
  }

  static isJson(str) {
    return /^[\],:{}\s]*$/.test(
      str
        .replace(/\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
    );
  }

  static camelizeKebab(str) {
    let arr = str.split('-');
    let capital = arr.map((item, index) =>
      index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item.toLowerCase()
    );
    let camelString = capital.join('');
    return camelString;
  }

  static getTimestamp() {
    return new Date().toISOString().substr(0, 19).replace('T', ' ');
  }

  static addSeconds(date, seconds) {
    const time = date.getTime() + seconds * 1000;
    const nextDate = new Date();
    nextDate.setTime(time);
    return nextDate;
  }
  static subtractSeconds(date, seconds) {
    const time = date.getTime() - seconds * 1000;
    const nextDate = new Date();
    nextDate.setTime(time);
    return nextDate;
  }

  static addDays(date, days) {
    const time = date.getTime() + days * 86400 * 1000;
    const nextDate = new Date();
    nextDate.setTime(time);
    return nextDate;
  }
  static subtractDays(date, days) {
    const time = date.getTime() - days * 86400 * 1000;
    const nextDate = new Date();
    nextDate.setTime(time);
    return nextDate;
  }

  static trim(charlist, str) {
    str = Helper.ltrim(charlist, str);
    return Helper.rtrim(charlist, str);
  }

  // ltrim and rtrim are broken
  static ltrim(charlist, str) {
    return str.replace(new RegExp('^[' + charlist + ']+'), '');
  }
  static rtrim(charlist, str) {
    return str.replace(new RegExp('[' + charlist + ']+$'), '');
  }

  static asset(item, role = 'assets') {
    item = typeof item === 'object' ? JSON.stringify(item) : item;
    if (!item) {
      return null;
    }
    if (!this.isJson(item)) {
      return item;
    }
    const parsed = JSON.parse(item);
    if (!parsed) {
      return null;
    }
    return `/api/storage/${parsed.drive}/${role}/${parsed.domain}/${parsed.pathname}`;
  }

  //

  static copyRecursiveSync(fs, path, src, dest, exclude = []) {
    if (exclude.indexOf(path.resolve(src)) !== -1) {
      return;
    }
    const stats = fs.existsSync(src) ? fs.statSync(src) : false;
    const isDirectory = !!stats && stats.isDirectory();
    if (isDirectory) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach((childItemName) => {
        this.copyRecursiveSync(fs, path, path.join(src, childItemName), path.join(dest, childItemName), exclude);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  static iterateRecursiveSync(fs, path, src, callback, exclude = []) {
    if (exclude.indexOf(path.resolve(src)) !== -1) {
      return;
    }
    const stats = fs.existsSync(src) ? fs.statSync(src) : false;
    const isDirectory = !!stats && stats.isDirectory();
    if (isDirectory) {
      callback(path.resolve(src));
      fs.readdirSync(src).forEach((childItemName) => {
        this.iterateRecursiveSync(fs, path, path.join(src, childItemName), callback, exclude);
      });
    } else {
      callback(path.resolve(src));
    }
  }

  static readdirSyncRecur(fs, path, dir, exclude = [], files = []) {
    fs.readdirSync(dir).map((item) => {
      const fullpath = path.resolve(dir, item);
      const isDir = fs.lstatSync(fullpath).isDirectory();
      if (isDir && exclude.indexOf(item) === -1) {
        this.readdirSyncRecur(fs, path, fullpath, exclude, files);
      }
      files.push({
        dir,
        filename: item,
        fullpath,
        extension: path.extname(item),
        isDir,
        isFile: !isDir,
      });
    });
    return files;
  }
}

module.exports = { Helper };

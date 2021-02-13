const fs = require('fs');
const locale = require('date-fns/locale');

const localePath = './src/locale';
const modulesPath = `${localePath}/modules`;

function rmRecursive(targetPath) {
  if (!fs.statSync(targetPath).isDirectory()) {
    fs.unlinkSync(targetPath);
    return;
  }

  fs.readdirSync(targetPath).forEach((child) => rmRecursive(`${targetPath}/${child}`));
  fs.rmdirSync(targetPath);
}

function cleanLocales() {
  rmRecursive(localePath);
}

function toBcp47(localeKey) {
  const pattern = /^([a-z]+)(.*)$/;
  const exec = pattern.exec(localeKey);
  if (exec[2]) {
    return `${exec[1]}-${exec[2]}`;
  }
  return exec[1];
}

function makeLocaleFile(localeKey) {
  const script = `import ${localeKey} from 'date-fns/locale/${toBcp47(localeKey)}';\nexport default ${localeKey};\n`;
  fs.writeFileSync(`${modulesPath}/${localeKey}.ts`, script, { mode: 0o644 });
}

function makeLocales() {
  fs.mkdirSync(modulesPath, {
    recursive: true,
    mode: 0o755,
  });

  const locales = Object.keys(locale);
  locales.forEach(makeLocaleFile);

  fs.writeFileSync(
    `${localePath}/keys.ts`,
    `export default new Set<string>(['${locales.join("','")}']);\n`,
    { mode: 0o644 }
  );
}

cleanLocales();
makeLocales();

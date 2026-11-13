import assert from 'node:assert/strict';
import { readFile, readdir, realpath, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const inside = (target) => {
  const relative = path.relative(root, target);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
};
async function resource(relative) {
  assert.equal(typeof relative, 'string');
  assert(!relative.includes('\\') && !relative.split('/').includes('..'), `Unsafe resource path: ${relative}`);
  const target = path.resolve(root, relative);
  assert(inside(target), `Resource escapes package: ${relative}`);
  const resolved = await realpath(target);
  assert(inside(resolved), `Resource resolves outside package: ${relative}`);
  assert((await lstat(target)).isFile(), `Resource must be a regular file: ${relative}`);
  return readFile(target, 'utf8');
}
const pkg = JSON.parse(await resource('package.json'));
assert.equal(pkg.name, '@local/dsh-turn-navigator');
assert.equal(pkg.author, 'gaoerge');
assert.equal(pkg.license, 'MIT');
assert.equal(pkg.engines?.dsh, '0.2.1-rc.5');
assert.equal(pkg.repository?.url, 'git+https://github.com/gaoerge/dsh-turn-navigator.git');
assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml');
assert.equal(pkg.dsh?.client?.platform, 'web');
assert.equal(pkg.dsh?.client?.immediately, true);
assert.deepEqual(pkg.dsh?.client?.inject, ['@deepseek-ai/dsh-client-ui-chat']);
assert.deepEqual(pkg.exports, {
  '.': './index.js',
  './client': './client.js',
  './locale/*.json': './locale/*.json',
  './icon': './icon.svg'
});
assert.equal(pkg.icon, './icon.svg');
const required = ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg', 'locale/en.json', 'locale/zh.json', 'README.md', 'README.en.md', 'LICENSE', 'CHANGELOG.md', 'scripts/verify.mjs'];
assert.deepEqual([...pkg.files].sort(), [...required].sort(), 'Keep the package files allowlist explicit');
for (const file of required) await resource(file);
for (const target of Object.values(pkg.exports)) {
  if (!target.includes('*')) await resource(target);
}
assert.equal(pkg.dependencies, undefined, 'This package needs no installed dependencies');
for (const lifecycle of ['preinstall', 'install', 'postinstall', 'prepare', 'prepack', 'postpack']) {
  assert(!Object.hasOwn(pkg.scripts ?? {}, lifecycle), `Unexpected lifecycle script: ${lifecycle}`);
}
for (const locale of ['en', 'zh']) {
  const data = JSON.parse(await resource(`locale/${locale}.json`));
  assert.deepEqual(Object.keys(data), ['meta']);
  assert.deepEqual(Object.keys(data.meta).sort(), ['description', 'title']);
  for (const value of Object.values(data.meta)) assert(typeof value === 'string' && value.trim().length > 0);
}
const svg = await resource(pkg.icon);
assert(Buffer.byteLength(svg) <= 256 * 1024, 'Icon exceeds the DSH resource size limit');
assert(/<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg) && /<\/svg>\s*$/.test(svg), 'Expected self-contained SVG artwork');
assert(!/<(?:script|foreignObject|!DOCTYPE|!ENTITY)\b|\bon\w+\s*=|(?:href|url)\s*[:=(]/i.test(svg), 'Icon must not load external or executable resources');
assert.match(await resource('cordis.patch.yml'), /^- insert:\r?\n    - id: local-turn-navigator\r?\n      name: '@local\/dsh-turn-navigator'\s*$/);
assert.match(await resource('client.js'), /id: '@local\/dsh-turn-navigator'/);
assert.match(await resource('LICENSE'), /Copyright \(c\) 2026 gaoerge/);

async function walk(directory = root) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const relative = path.relative(root, path.join(directory, entry.name));
    assert(!entry.isSymbolicLink(), `Do not ship symbolic links: ${relative}`);
    assert(!/^(backup|node_modules)$/.test(entry.name), `Unexpected directory: ${relative}`);
    assert(!/^(viewport-rendering\.js|apply-viewport-patch\.cjs)$/.test(entry.name), `Experimental patch excluded: ${relative}`);
    if (entry.isDirectory()) await walk(path.join(directory, entry.name));
  }
}
await walk();
console.log('Verified manifest, explicit files/exports, locales, original SVG, identifiers and resource boundaries. No dependencies installed.');

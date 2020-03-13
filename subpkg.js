#!/usr/bin/env node

const path = require('path');
const child_process = require('child_process');

const args = process.argv.slice(2);
if (!args.length) return;

const pkgJson = require(path.join(process.cwd(), 'package.json'));
const subPackages = pkgJson.subPackages;
if (!subPackages) throw new Error('No "subPackages" entry found in package.json.');

const found = subPackages.find(p => p === args[0]);
if (found && args.length > 1) {
  const subPkgPath = path.join(process.cwd(), found);
  const subPkgJson = require(path.join(subPkgPath, 'package.json'));
  if (subPkgJson.scripts && subPkgJson.scripts[args[1]]) {
    args[0] = 'run';

    console.log('Running\x1b[36m npm', args.join(' '), '\x1b[0mfor package \x1b[34m' + subPkgJson.name + '\x1b[0m...');
    const result = child_process.spawnSync('npm', args, {
      stdio: 'inherit',
      cwd: path.resolve(subPkgPath),
    });
    process.exit(result.status);
  }
}

console.log('Running\x1b[36m npm', args.join(' '), '\x1b[0mfor', subPackages.length, 'packages...');
for (const subPackage of subPackages) {
  const subPkgPath = path.join(process.cwd(), subPackage);
  const subPkgJson = require(path.join(subPkgPath, 'package.json'));

  if (args[0] === 'run' && (args.length === 1 || !subPkgJson.scripts || !subPkgJson.scripts[args[1]])) {
    console.log('\x1b[90mSkipping package' + subPkgJson.name + '...\x1b[0m');
    continue;
  }

  console.log('Package \x1b[34m' + subPkgJson.name + '\x1b[0m...');
  const result = child_process.spawnSync('npm', args, {
    stdio: 'inherit',
    cwd: path.resolve(subPkgPath),
  });

  if (result.status !== 0) process.exit(result.status);
}

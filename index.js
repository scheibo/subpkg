#!/usr/bin/env node
'use strict'

const path = require('path');
const child_process = require('child_process');

const spawn = (cmd, args, cwd, env) => child_process.spawnSync(cmd, args, {stdio: 'inherit', cwd, env});
const error = (msg) => { console.error(msg); process.exit(1); };

const find = (dir = process.cwd(), subPackage = '') => {
  try {
    const packageJson = require(path.join(dir, 'package.json'));
    const subPackages = packageJson.subPackages;
    if (!subPackages) return find(path.dirname(dir), path.join(path.basename(dir), subPackage));
    if (subPackage && subPackages.includes(subPackage)) return {dir, packageJson, subPackage};
    return {dir, packageJson, subPackage: '', subPackageJson: ''}
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') throw err;
    if (dir === '/') throw new Error('No "subPackages" entry found in any package.json.');
    return find(path.dirname(dir), path.join(path.basename(dir), subPackage));
  }
};

const args = process.argv.slice(2);
if (!args.length) return;

const {dir, packageJson, subPackage} = find();

const run = args[0] === 'run';
const cmd = args[+run];
const cmdargs = args.slice(0, 1 + run);
if (!run && packageJson.scripts && packageJson.scripts[cmd]) cmdargs.unshift('run');
const subPackages = args.slice(1 + run);

const env = {
  ...process.env,
  PATH: process.env.PATH ? `${process.env.PATH}:${dir}/node_modules/.bin` : `${dir}/node_modules/.bin`,
};

if (!(packageJson.scripts && packageJson.scripts[cmd])) error(`Unknown script: '${cmd}'`);
if (subPackage && !subPackages.includes(subPackage)) subPackages.unshift(subPackage);

if (subPackages.length === 1) {
  const subPackage = subPackages[0];
  if (!packageJson.subPackages.includes(subPackage)) error(`Unknown subPackage '${subPackage}'`);
  const subPackageJson = require(path.resolve(dir, subPackage, 'package.json'));

  if (run && !(subPackageJson.scripts && subPackageJson.scripts[cmd])) {
    error(`'${subPackageJson.name}' does not have script '${cmd}'`);
  }

  console.log('Running\x1b[36m npm', cmdargs.join(' '), '\x1b[0mfor package \x1b[34m' + subPackageJson.name + '\x1b[0m...');
  const result = spawn('npm', cmdargs, path.resolve(dir, subPackage), env);
  process.exit(result.status);
} else {
  console.log('Running\x1b[36m npm', cmdargs.join(' '), '\x1b[0mfor', subPackages.length, 'packages...');
  for (const subPackage of subPackages) {
    if (!packageJson.subPackages.includes(subPackage)) error(`Unknown subPackage '${subPackage}'D`);
    const subPackageJson = require(path.resolve(dir, subPackage, 'package.json'));

    if (run && !(subPackageJson.scripts && subPackageJson.scripts[cmd])) {
      console.log('\x1b[90mSkipping package' + subPackageJson.name + '...\x1b[0m');
      continue;
    }

    console.log('Package \x1b[34m' + subPackageJson.name + '\x1b[0m...');
    const result = spawn('npm', cmdargs, path.resolve(dir, subPackage), env);
    if (result.status !== 0) process.exit(result.status);
  }
}

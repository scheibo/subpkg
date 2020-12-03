# `subpkg`

[![npm version](https://img.shields.io/npm/v/subpkg.svg)](https://www.npmjs.com/package/subpkg)

`subpkg` is a roughly API-compatible implementation of
[`subpackage`](https://github.com/dupski/subpackage) which has zero dependencies and trades support
for environment variables for several additional features like linking and version bumping. `subpkg`
allows you to run scripts defined in `package.json` across multiple sub-projects and serves as a
minimal alternative to [Lerna](https://github.com/lerna/lerna) or `pnpm`'s support for
['workspaces'](https://pnpm.js.org/en/workspaces).

## Usage

```sh
$ npm install --save-dev subpkg
```

```json
{
    "name": "my-awesome-project",
    "version": "2.5.1",

    "subPackages": [
        "packages/sub-package-1",
        "packages/sub-package-2"
    ],
    "scripts": {
      "postinstall": "subpkg install && ...",
      "build": "subpkg run build && ..."
    }
}
```

### Dynamic modules

```json
{
    "name": "my-awesome-project",
    "version": "2.5.1",

    "subPackages": {
        "folderA" : "statusesA.json",
        "folderB" : "statusesB.json"
    },
    "scripts": {
      "postinstall": "subpkg install && ...",
      "build": "subpkg run build && ..."
    }
}
```

With `statusesX.json` relative to root directory and specifying active/inactive modules in `folderX` sub-folder relative to root directory:

```json
{
    "sub-package-1": true,
    "sub-package-2": true,
    "sub-package-3": false,
}
```

Modules set to `false` will not be taken into account.

#### Laravel Modules

This feature allows seamless integration with [nWidart/laravel-modules](https://github.com/nWidart/laravel-modules) project:

```json
{
    "name": "my-awesome-project",
    "version": "2.5.1",

    "subPackages": {
        "modules" : "modules_statuses.json"
    }
}
```

## License

`subpkg` is distributed under the terms of the [MIT License](LICENSE).

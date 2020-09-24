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

## License

`subpkg` is distributed under the terms of the [MIT License](LICENSE).

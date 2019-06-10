# subpkg
[![npm version](https://img.shields.io/npm/v/subpkg.svg)](https://www.npmjs.com/package/subpkg)&nbsp;

subpkg is a pared-down, API-compatible implementation of [subpackage][0] with zero dependencies.
subpkg allows you to run scripts defined in `package.json` across multiple sub-projects.

[0]: https://github.com/dupski/subpackage

## Usage

```
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

subpkg is distributed under the terms of the MIT License.

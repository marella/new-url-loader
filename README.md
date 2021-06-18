# [new-url-loader](https://github.com/marella/new-url-loader) [![tests](https://github.com/marella/new-url-loader/actions/workflows/tests.yml/badge.svg)](https://github.com/marella/new-url-loader/actions/workflows/tests.yml) [![Coverage Status](https://coveralls.io/repos/github/marella/new-url-loader/badge.svg)](https://coveralls.io/github/marella/new-url-loader) [![install size](https://packagephobia.com/badge?p=new-url-loader)](https://packagephobia.com/result?p=new-url-loader)

A tiny alternative to `url-loader` and `file-loader` for webpack 5.

The `url-loader` and `file-loader` are deprecated in webpack 5 and replaced by [asset modules](https://webpack.js.org/guides/asset-modules/). Loaders that are used with `url-loader` or `file-loader` (example: `@svgr/webpack` in Create React App) might still need them. `new-url-loader` provides the functionality of both `url-loader` and `file-loader` using asset modules and [URL assets](https://webpack.js.org/guides/asset-modules/#url-assets).

## Installation

```sh
npm install new-url-loader --save-dev
```

## Usage

If you are using `url-loader` or `file-loader` with another loader (example: `@svgr/webpack`), you can replace them with `new-url-loader`. The following examples show how to configure webpack to load SVGs using `@svgr/webpack`.

### Replacing `url-loader`

**Old**

```js
{
  test: /\.svg$/,
  use: ['@svgr/webpack', 'url-loader'],
}
```

**New**

```js
{
  test: /\.svg$/,
  oneOf: [
    {
      dependency: { not: ['url'] }, // exclude new URL calls
      use: ['@svgr/webpack', 'new-url-loader'],
    },
    {
      type: 'asset', // export a data URI or emit a separate file
    },
  ],
}
```

By default, a file with size less than 8kb will be inlined as a data URI and emitted as a separate file otherwise. To change the file size limit, use:

```js
{
  type: 'asset',
  parser: {
    dataUrlCondition: {
      maxSize: 4 * 1024, // 4kb
    },
  },
}
```

You can also specify a function to decide whether to inline a file or not. [Learn more](https://webpack.js.org/configuration/module/#ruleparserdataurlcondition)

### Replacing `file-loader`

**Old**

```js
{
  test: /\.svg$/,
  use: ['@svgr/webpack', 'file-loader'],
}
```

**New**

```js
{
  test: /\.svg$/,
  oneOf: [
    {
      dependency: { not: ['url'] }, // exclude new URL calls
      use: ['@svgr/webpack', 'new-url-loader'],
    },
    {
      type: 'asset/resource', // emit a separate file
    },
  ],
}
```

By default, files are emitted with `[hash][ext][query]` name to output directory. To customize the output filename, use:

```js
{
  type: 'asset/resource',
  generator: {
    filename: 'static/media/[name].[hash][ext]',
  },
}
```

It also works with `asset` module type. [Learn more](https://webpack.js.org/guides/asset-modules/#custom-output-filename)

### Examples

See [examples](https://github.com/marella/new-url-loader/tree/main/examples/svgr).

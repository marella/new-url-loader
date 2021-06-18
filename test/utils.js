const Module = require('module');
const path = require('path');
const webpack = require('webpack');
const { createFsFromVolume, Volume } = require('memfs');

/**
 * @see https://github.com/webpack-contrib/file-loader/blob/master/test/helpers/compile.js
 * @see https://github.com/webpack-contrib/file-loader/blob/master/test/helpers/readAsset.js
 * @see https://github.com/gregberge/svgr/blob/main/packages/webpack/src/index.test.js
 */
const compile = async (rule, { entry, publicPath = '', baseURI } = {}) => {
  const compiler = webpack({
    mode: 'production',
    context: __dirname,
    entry: `./fixtures/${entry}`,
    output: {
      publicPath,
      hashDigestLength: 32, // default is 20 but file-loader uses 32
    },
    module: { rules: [rule] },
  });
  const fs = (compiler.outputFileSystem = createFsFromVolume(new Volume()));
  const stats = await new Promise((resolve, reject) => {
    compiler.run((err, stats) => (err ? reject(err) : resolve(stats)));
  });
  const dist = stats.compilation.outputOptions.path;
  const content = fs.readFileSync(path.join(dist, 'main.js')).toString();
  return execute(content, { baseURI }).toString();
};

/**
 * @see https://github.com/webpack-contrib/file-loader/blob/master/test/helpers/execute.js
 * @see https://github.com/webpack-contrib/url-loader/blob/master/test/helpers/execute.js
 */
const execute = (code, { baseURI } = {}) => {
  const resource = 'test.js';
  const mod = new Module(resource, module);
  mod.paths = Module._nodeModulePaths(path.resolve(__dirname, './fixtures'));
  mod.filename = resource;
  mod._compile(script(code, { baseURI }), resource);
  return mod.exports;
};

const script = (code, { baseURI = 'http://localhost/' } = {}) => `
const document = { baseURI: ${JSON.stringify(baseURI)} };
let __export__;
${code};
module.exports = __export__;
`;

module.exports = {
  compile,
};

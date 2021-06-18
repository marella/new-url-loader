const path = require('path');
const { compile } = require('./utils');

const loader = path.resolve(__dirname, '../index.js');
const files = /\.(png|svg)$/;
const entries = ['simple.js', 'nested.js'];
const publicPaths = ['', '/', '/foo/', '/foo/bar', 'foo/', 'foo/bar'];
const baseURIs = [
  'http://localhost/',
  'http://localhost/foo/',
  'http://localhost/foo/bar',
];
const table = [];
for (const entry of entries) {
  for (const publicPath of publicPaths) {
    for (const baseURI of baseURIs) {
      table.push({ entry, publicPath, baseURI });
    }
  }
}

describe('loader', () => {
  it.each(entries)("should match url-loader { entry: '%s' }", async (entry) => {
    const actual = await compile(
      {
        test: files,
        oneOf: [
          {
            dependency: { not: ['url'] },
            use: [loader],
          },
          {
            type: 'asset',
          },
        ],
      },
      { entry }
    );
    // expect(actual).toMatchSnapshot('result');

    const expected = await compile(
      {
        test: files,
        use: ['url-loader'],
      },
      { entry }
    );
    expect(actual).toEqual(expected);
  });

  it.each(table)(
    "should match file-loader { entry: '$entry', publicPath: '$publicPath', baseURI: '$baseURI' }",
    async ({ entry, publicPath, baseURI }) => {
      const actual = await compile(
        {
          test: files,
          oneOf: [
            {
              dependency: { not: ['url'] },
              use: [loader],
            },
            {
              type: 'asset/resource',
            },
          ],
        },
        { entry, publicPath, baseURI }
      );
      // expect(actual).toMatchSnapshot('result');

      const path = await compile(
        {
          test: files,
          use: ['file-loader'],
        },
        { entry, publicPath }
      );
      // new-url-loader returns an URL where as file-loader returns a path
      // both should resolve to the same URL when using the same baseURI
      const expected = new URL(path, baseURI).toString();
      expect(actual).toEqual(expected);
    }
  );
});

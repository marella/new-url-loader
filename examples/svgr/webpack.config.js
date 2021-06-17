module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            dependency: { not: ['url'] },
            use: ['@svgr/webpack', '../../index.js' /* 'new-url-loader' */],
          },
          {
            type: 'asset', // Use 'asset/resource' for file-loader
          },
        ],
      },
    ],
  },
};

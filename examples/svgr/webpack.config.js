module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            dependency: { not: ['url'] },
            use: ['@svgr/webpack', 'new-url-loader'],
          },
          {
            type: 'asset', // Use 'asset/resource' for file-loader
          },
        ],
      },
    ],
  },
};

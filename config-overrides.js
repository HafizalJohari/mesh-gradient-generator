module.exports = function override(config, env) {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules\/(?!(gif\.js)\/).*/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    });
    return config;
  }
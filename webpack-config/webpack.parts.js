const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");

exports.setFreeVariable = (key, value) => {
  const env = {};
  env[key] = JSON.stringify(value);
  return {
    plugins: [new webpack.DefinePlugin(env)]
  };
};

// DEVELOPMENT CONFIGS

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: "errors-only",
    hotOnly: true,
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
});

// PRODUCTION CONFIGS

exports.clean = path => ({
  plugins: [new CleanWebpackPlugin([path], { allowExternal: true })]
});

exports.minifyJavaScript = () => ({
  optimization: {
    minimizer: [new UglifyWebpackPlugin({ sourceMap: true })]
  }
});

exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false
    })
  ]
});

// CSS CONFIG

exports.loadGlobalCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        include,
        exclude,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  }
});

exports.cssModules = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        include,
        exclude,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[local]_[hash:base64:8]"
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  }
});

exports.extractGlobalCSS = ({ include, exclude }) => {
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed to extract from extracted chunks as well
    allChunks: true,
    //filename: "static/styles/[name].[contenthash:8].css"
    filename: "static/styles/[name].[md5:contenthash:hex:20].css"
  });
  return {
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          include,
          exclude,
          use: plugin.extract({
            use: [
              {
                loader: "css-loader",
              },
              {
                loader: "sass-loader"
              },
              autoprefix()
            ]
          })
        }
      ]
    },
    plugins: [plugin]
  };
};



exports.extractCSS = ({ include, exclude }) => {
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed to extract from extracted chunks as well
    allChunks: true,
    //filename: "static/styles/[name].[contenthash:8].css"
    filename: "static/styles/[name].[md5:contenthash:hex:20].css"
  });
  return {
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          include,
          exclude,
          use: plugin.extract({
            use: [
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[local]_[hash:base64]"
                }
              },
              {
                loader: "sass-loader"
              },
              autoprefix()
            ]
          })
        }
      ]
    },
    plugins: [plugin]
  };
};

autoprefix = () => ({
  loader: "postcss-loader",
  options: {
    plugins: () => [require("autoprefixer")()]
  }
});

// IMAGE CONFIGS

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include,
        exclude,
        use: {
          loader: "url-loader",
          options
        }
      }
    ]
  }
});

// JAVASCRIPT CONFIGS

exports.loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)?$/,
        include,
        exclude,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          },
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  }
});

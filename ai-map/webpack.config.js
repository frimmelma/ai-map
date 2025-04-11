// This file is used to override the webpack configuration from react-scripts
const path = require('path');

module.exports = function(webpackEnv) {
  return {
    // Override webpack-dev-server options to fix deprecation warnings
    devServer: {
      setupMiddlewares: (middlewares, devServer) => {
        // Your custom middleware setup can go here if needed
        return middlewares;
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      hot: true,
      liveReload: true,
      // Explicitly disable deprecated options
      onBeforeSetupMiddleware: null,
      onAfterSetupMiddleware: null,
    },
    // Disable performance hints
    performance: {
      hints: false,
    },
    // Silence deprecation warnings
    ignoreWarnings: [
      {
        module: /mini-css-extract-plugin/,
      },
      {
        module: /postcss-loader/,
      },
      {
        module: /terser-webpack-plugin/,
      },
      {
        module: /webpack-dev-server/,
      },
      (warning) => true,
    ],
  };
};

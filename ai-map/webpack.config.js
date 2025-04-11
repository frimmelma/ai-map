// This file is used to override the webpack configuration from react-scripts
const path = require('path');

module.exports = {
  // Override webpack-dev-server options to fix deprecation warnings
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      // Your custom middleware setup can go here if needed
      return middlewares;
    }
  }
};

#!/bin/bash

# Set environment variables to suppress warnings
export NODE_OPTIONS=--no-deprecation
export DISABLE_ESLINT_PLUGIN=true
export BROWSER=none
export GENERATE_SOURCEMAP=false
export WDS_SOCKET_HOST=localhost
export WDS_SOCKET_PORT=0

# Start the application
npm start

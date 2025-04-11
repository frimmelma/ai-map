FROM node:20-alpine

WORKDIR /app

# Copy package.json and related files first to leverage Docker cache
COPY ai-map/package.json ai-map/.npmrc ai-map/.yarnrc ./

# Install dependencies silently
RUN npm install --silent

# Copy the rest of the application
COPY ai-map/ ./

# Set environment variables to suppress warnings
ENV NODE_OPTIONS=--no-deprecation
ENV DISABLE_ESLINT_PLUGIN=true
ENV BROWSER=none
ENV GENERATE_SOURCEMAP=false
ENV WDS_SOCKET_HOST=0.0.0.0
ENV WDS_SOCKET_PORT=0

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

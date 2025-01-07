# Use an official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install all dependencies, including development dependencies.
RUN npm install

# Run the prebuild script to generate the sitemap.
RUN npm run prebuild

# Build the Next.js app
RUN npm run build

# Copy local code to the container image.
COPY . .

EXPOSE 3000

# Run the web service on container startup.
CMD [ "npm", "start" ]

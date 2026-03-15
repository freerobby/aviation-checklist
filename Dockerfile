# syntax=docker/dockerfile:1
FROM node:24-alpine

# Install git (useful for devcontainer) and bash (nicer shell than sh)
RUN apk add --no-cache git bash

# Enable corepack so yarn is managed via package.json#packageManager
RUN corepack enable

WORKDIR /workspace

# Copy dependency manifests first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Expose Vue CLI dev server port
EXPOSE 8080

# Default: start the dev server with host binding so it's reachable from outside the container
CMD ["yarn", "serve", "--", "--host", "0.0.0.0"]

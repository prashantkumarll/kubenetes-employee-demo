# Stage 1: Build the React application
# Use a Node.js image as the base for building the React app
FROM node:20-alpine AS build

# Define a build argument for the API base URL (Vite uses VITE_ prefix)
ARG VITE_APP_API_BASE_URL

# Set environment variables inside the container for the build process
# NODE_ENV is crucial for build tools to perform optimizations
# VITE_APP_API_BASE_URL is for Vite environment variable substitution
#ENV NODE_ENV=production
ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to leverage Docker cache
# This step is crucial for faster builds if dependencies don't change
COPY package*.json ./

# Install dependencies
# This ensures esbuild (and other native dependencies) are installed for the Linux environment
RUN npm ci

# Copy the rest of the application code
# Ensure you have a .dockerignore file to exclude node_modules from the host
COPY . .

# Build the React application for production using Vite's build command
# Using npx ensures the locally installed vite executable is found and run.
# The environment variables will be "baked in" during this step
RUN npm run build

# Stage 2: Serve the React application with Nginx
# Use a lightweight Nginx image to serve the static files
FROM nginx:alpine

# Copy the Nginx default configuration file
# This is a basic configuration that serves static files
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the 'build' stage to Nginx's serving directory
# Vite's default output directory is 'dist'
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80, which Nginx listens on by default
EXPOSE 80

# Command to run Nginx when the container starts
# This command keeps Nginx running in the foreground
CMD ["nginx", "-g", "daemon off;"]
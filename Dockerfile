# ### BUILD STAGE
# FROM node:18-alpine as build

# WORKDIR /app/

# COPY package.json yarn.lock /app/

# RUN yarn

# COPY . /app/

# RUN yarn build

# # ### RUN STAGE
# FROM nginx:alpine

# COPY --from=build /app/dist/ /usr/share/nginx/html/

# COPY --from=build /app/nginx.conf  /etc/nginx/conf.d/default.conf

# EXPOSE 8080

# ENTRYPOINT ["nginx", "-g", "daemon off;"] 

# --- BUILD STAGE ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn

COPY . /app/
RUN yarn build

# --- RUN STAGE ---
FROM node:18-alpine

# Install Nginx
RUN apk add --no-cache nginx

# Set up working directory
WORKDIR /app

# Copy the React Vite build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy your Nginx configuration file (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy your Node.js app (optional, if you want to serve an API)
COPY server.js /app/server.js

# Expose the port for Nginx
EXPOSE 8080

# Start Nginx and Node.js in parallel
CMD ["sh", "-c", "nginx && node server.js"]

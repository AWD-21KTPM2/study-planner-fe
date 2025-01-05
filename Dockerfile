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
# FROM node:18-alpine AS build

# WORKDIR /app

# COPY package.json yarn.lock /app/
# RUN yarn

# COPY . /app/
# RUN yarn build

# CMD ["yarn", "dev", "--host", "0.0.0.0"]





# --- BUILD STAGE ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn

COPY . /app/
RUN yarn build

# --- RUN STAGE ---
FROM node:18-alpine AS dev

WORKDIR /app

COPY --from=build /app /app

EXPOSE 8080

CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "$PORT"]



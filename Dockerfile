### BUILD STAGE
FROM node:18-alpine as build

WORKDIR /app/

COPY package.json yarn.lock /app/

RUN yarn

COPY . /app/

RUN yarn build

# ### RUN STAGE
FROM nginx:alpine

COPY --from=build /app/dist/ /usr/share/nginx/html/

COPY --from=build /app/nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"] 

# Build process
FROM node:lts-alpine as BUILDER

WORKDIR /usr/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout 100000

COPY . ./
RUN yarn build

# Main service
FROM node:lts-alpine

WORKDIR /code
ENV NODE_ENV=production

COPY package.json ./
COPY yarn.lock ./
RUN yarn --frozen-lockfile --network-timeout 100000

COPY --from=BUILDER /usr/app/dist ./
RUN chmod a+x ./main.js
ENTRYPOINT [ "node", "./main.js" ]

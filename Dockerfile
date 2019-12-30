FROM node:10.16.0 as dev
WORKDIR /app/

# Extract yarn cache if we have one
COPY .docker-yarn-cache* .nvmrc /tmp/
RUN mkdir -p /usr/local/share/.cache/yarn/v4 && tar -xf /tmp/.docker-yarn-cache -C /usr/local/share/.cache/yarn/v4 2>/dev/null || true && rm -f /tmp/.nvmrc /tmp/.docker-yarn-cache

COPY Makefile ./
COPY server/package.json ./server/
COPY server/yarn.lock ./server/
COPY frontend/package.json ./frontend/
COPY frontend/yarn.lock ./frontend/

RUN make install-deps

FROM node:10.16.0 as build
WORKDIR /app/

COPY Makefile ./
COPY server ./server/
COPY frontend ./frontend/

# Copy yarn cache to speed up install
COPY --from=dev /usr/local/share/.cache/yarn/v4 /usr/local/share/.cache/yarn/v4

RUN make

FROM node:10.16.0-alpine as production
WORKDIR /app/

# Copy over built code
COPY --from=build /app/dist/ ./

# Install production dependencies for server and then clear cache to make the image smaller.
COPY server/package.json server/yarn.lock ./
RUN yarn install --prod --cache-folder ./ycache && \
  rm -rf ./ycache

CMD node ./server/index.js

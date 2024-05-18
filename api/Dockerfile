# TODO: Consider using 2 steps, one for building, then copy the build artifacts to a new image for running. Talk with FE team about this.

FROM node:22.2.0-alpine


WORKDIR /app


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY api/package.json api/tsconfig.json ./api/
COPY shared/package.json shared/tsconfig.json ./shared/

# Install jq to extract the version of pnpm from the package.json
RUN apk add --no-cache jq

# Extract the version of pnpm from the package.json and install it
RUN export PNPM_VERSION=$(jq -r '.packageManager' /app/package.json | cut -d '@' -f 2) && \
    npm install -g pnpm@$PNPM_VERSION

COPY api ./api
COPY shared ./shared

RUN pnpm run api:deps


RUN pnpm api:build


EXPOSE 4000


CMD ["pnpm", "api:prod"]

FROM node:22.2.0-alpine


WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json .npmrc ./
COPY odata-server/package.json odata-server/tsconfig.json ./odata-server/
COPY shared/package.json shared/tsconfig.json ./shared/

RUN corepack enable pnpm


COPY odata-server ./odata-server
COPY shared ./shared


RUN pnpm install

# TODO: Make this configurable
EXPOSE 4001


CMD ["pnpm", "odata-server:prod"]

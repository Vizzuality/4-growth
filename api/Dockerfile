FROM node:22.2.0-alpine


WORKDIR /app


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY api/package.json api/tsconfig.json ./api/
COPY shared/package.json shared/tsconfig.json ./shared/

RUN corepack enable pnpm


COPY api ./api
COPY shared ./shared

RUN pnpm run api:deps


RUN pnpm api:build


EXPOSE 4000


CMD ["pnpm", "api:prod"]

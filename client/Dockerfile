FROM node:22.2.0-alpine

ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

WORKDIR /app


COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.json ./
COPY client/package.json client/tsconfig.json ./client/
COPY shared/package.json shared/tsconfig.json ./shared/

RUN corepack enable pnpm

COPY client ./client
COPY shared ./shared

RUN pnpm client:deps




RUN pnpm client:build

EXPOSE 3000


CMD ["pnpm", "client:prod"]

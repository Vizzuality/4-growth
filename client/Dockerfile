FROM node:22.2.0-alpine

ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG AUTH_CREDENTIALS

ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL
ENV NEXTAUTH_SECRET $NEXTAUTH_SECRET
ENV NEXTAUTH_URL $NEXTAUTH_URL
ENV AUTH_CREDENTIALS $AUTH_CREDENTIALS

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

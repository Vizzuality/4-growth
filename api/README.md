# 4-GROWTH API

This project is built with NestJS.

## NestJS Version

The project uses NestJS version 10.0.0.

## Package Manager

The project uses `pnpm` as the package manager.

## Node Version

The project uses Node.js version 20.10.0 as specified in the `.nvmrc` file.

## Continuous Integration

The project uses GitHub Actions for continuous integration. The workflow for API tests is defined in `.github/workflows/api-tests.yml`. This workflow runs end-to-end tests on every push to the `api` directory and can also be manually triggered.

## Scripts

Here are some of the npm scripts that you can run:

- `pnpm build`: Compiles the TypeScript code
- `pnpm start`: Starts the application
- `pnpm start:dev`: Starts the application in watch mode
- `pnpm test`: Runs the tests
- `pnpm typeorm`: Execute typeorm CLI
- `pnpm typeorm migration:run -d src/infrastructure/data-sources/postgres-data-source.ts`: Run typeorm migrations

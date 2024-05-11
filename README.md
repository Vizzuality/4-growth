# 4-GROWTH

This is a mono-repo project that contains several applications, all part of the 4-GROWTH initiative. The applications are built using a variety of technologies, including TypeScript, JavaScript, and React.

## Applications

The repository includes the following applications:

- `api`: This is the backend application, built with NestJS.
- `client`: This is the frontend application, built with React.

TODO: Add the following applications to the list:
- `admin`: This is the admin panel

## Package Manager

We use `pnpm` for managing packages in this project. This allows us to efficiently share common dependencies across the different applications in the mono-repo.

## Mono-repo Architecture

The mono-repo architecture allows us to keep all our related applications in one place, making it easier to share code and manage dependencies. Each application resides in its own directory and has its own `package.json` file.

## Scripts

Here are some of the npm scripts that you can run:

- `pnpm start:api`: Starts the backend application
- `pnpm start:client`: Starts the application in watch mode
- `pnpm install`: Install all dependencies

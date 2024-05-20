# 4-GROWTH

This is a mono-repo project that contains several applications, all part of the 4-GROWTH initiative. The applications are built using a variety of technologies.

## Monorepo Structure

The repository is structured as a monorepo, with each application residing in its own directory. We also have a `shared` directory that contains code shared across the applications. The `shared` directory is a dev dependency for the `client` application and a dependency for the `api` application.

Here is the directory structure:

- `api`: This is the backend application, built with NestJS.
- `client`: This is the frontend application, built with React.
- `shared`: This directory contains shared code used by the other applications.

## Package Manager

We use `pnpm` for managing packages in this project. This allows us to efficiently share common dependencies across the different applications in the mono-repo.

## Scripts

Here are the npm scripts that you can run:

- `pnpm api:dev`: Starts the backend application in development mode.
- `pnpm client:dev`: Starts the frontend application in development mode.
- `pnpm client:deps`: Installs the client application dependencies.
- `pnpm api:deps`: Installs the API application dependencies.
- `pnpm client:build`: Builds the client application for production.
- `pnpm api:build`: Builds the API application for production.
- `pnpm client:prod`: Starts the client application in production mode.
- `pnpm api:prod`: Starts the API application in production mode.
- `pnpm all:prod`: Builds and starts both applications in production mode.

## TypeScript Configuration

The TypeScript configuration is defined in the `tsconfig.json` file at the root of the project. This file includes compiler options and paths for TypeScript to follow when compiling the code.

The `compilerOptions` section includes settings such as the target JavaScript version, module system, and whether to emit JavaScript files. The `paths` section is used to map certain import paths to their corresponding locations in the project, which is particularly useful in a monorepo setup.

Each application also has its own `tsconfig.json` file that extends the root configuration and includes application-specific settings.

Please refer to the TypeScript documentation for more details on the various compiler options and how to use them.

## Dockerisation

The applications in this project are containerized using Docker. Each application has its own `Dockerfile` that specifies how to build a Docker image for the application.
There is also a `docker-compose.yml` file that defines a multi-container setup for running the applications together.

Since the project is a monorepo setup, it's important to run your commands from the root, for the Dockerfiles to have the correct context.

To build the Docker images for the applications, you can use the following commands:

- `docker build -t <image_name> -f api/Dockerfile .`: Builds a Docker image for the API application.
- `docker build -t <image_name> -f client/Dockerfile .`: Builds a Docker image for the client application.

To run the apps using the `docker-compose` file, you can use the following command:

- `docker-compose up`: Starts the applications in a multi-container setup.
- `docker-compose down`: Stops and removes the containers.
- `docker-compose up --build`: Rebuilds the images and starts the containers.
- `docker-compose up -d api --build`: Starts only the API application in detached mode and rebuilds the image.
- `docker-compose up -d client --build`: Starts only the client application in detached mode and rebuilds the image.

## TODO

There are several aspects of the project that still need to be documented:

- **Testing Procedures**: Explain how to run unit tests, integration tests, and end-to-end tests. Include information about any testing frameworks or libraries used.

- **Deployment Procedures**: Describe the steps to deploy the applications in different environments (development, staging, production). Include any necessary commands, environment variables, or configuration files.

- **Infrastructure Setup**: Provide details about the infrastructure that supports the applications. This could include servers, databases, cloud services, and networking components. Include instructions for setting up and managing these resources.

- **Additional Documentation**: There may be other aspects of the project that are not yet fully documented. Identify these areas and add them to the list of tasks.
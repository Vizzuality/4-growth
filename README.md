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


## Environment Variables

The different services in this project use environment variables to configure their behavior. There are different ways to set environment variables depending on the service and the environment.

### API

We use [config](https://www.npmjs.com/package/config) to manage environment variables. The configuration files are stored in `api/config`. 
Please refer to the `config` documentation for to understand how the configuration files are loaded and the hierarchy of configuration.

To make use of you personal environment variables, you can create a `local.json` file (which is gitignored in the project) in the `api/config` directory and add your environment variables for the API there.

### CLIENT

The client application uses `.env` files to manage environment variables. The handling of existing `.env` files is managed by NextJS, please refer
to the official [NextJS Environment Vars](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables) official documentation for more information.

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
- `docker-compose up -d database`: Starts only the database in detached mode and rebuilds the image.

## Data Management & ETL Process

The application relies on external data sources that are periodically ingested and processed through an ETL (Extract, Transform, Load) pipeline.

### Data Flow

1. **External Source**: Data is fetched from OData endpoints (WUR data services) using OAuth authentication
2. **Local Storage**: Downloaded datasets are stored as JSON/CSV files in `api/data/` directories
3. **Database Import**: Processed files are automatically loaded into the database when the application starts or when the ETL process runs

### ETL Process

The ETL process consists of three main steps:

1. **Extract**: Downloads raw datasets from OData endpoints and saves them as JSON files in `api/data/surveys/`
2. **Transform**: Processes and joins the raw data:
   - Survey data transformation combines multiple datasets via manual joins
   - Projection data transformation processes CSV files into structured JSON
3. **Load**: Imports the transformed JSON files into the database

### Automated ETL

The ETL process runs automatically every Sunday at 3:00 AM via a scheduled cron job. This can be controlled using the `ETL_CRON_ENABLED` environment variable.

When the ETL process completes (successfully or with errors), email notifications are sent to configured recipients via the `ETL_PROCESS_EMAILS` environment variable.

### Manual ETL Execution

You can run the ETL process manually using these scripts in the `api` package:

```bash
# Step 1: Extract data from OData endpoints
pnpm extract:surveys

# Step 2: Transform survey data
pnpm transform:surveys

# Step 3: Transform projection data
pnpm transform:projections
```

After running these scripts, the processed files will be available in:
- `api/data/surveys/surveys.json`
- `api/data/projections/projections.json`
- `api/data/sections/sections.json`

The application will automatically import these files into the database on the next startup or when the scheduled ETL runs.

### Data Directories

- `api/data/surveys/` - Survey datasets and transformation scripts
- `api/data/projections/` - Projection datasets (CSV files) and transformation scripts
- `api/data/sections/` - Section configuration files
- `api/data/filters.sql` - SQL for page filters
- `api/data/question-indicators.sql` - SQL for question-indicator mappings

### Question-Indicator Mapping

A critical component of the survey data architecture is the **question-indicator map** (`api/data/question-indicators.sql`). This mapping connects survey questions to widget indicators.

- Each widget is associated with an indicator ID
- Each indicator ID maps to specific survey questions
- This indirection layer allows the data model to evolve without breaking existing widgets
- The mapping is loaded during the ETL process and kept in sync with the database

**Architecture Decision**: This indirection layer was introduced as an architectural solution to handle the volatility of the survey data model. During development, the survey data structure changed 2-3 times, and we needed a flexible way to maintain the connection between questions and widgets without breaking the application. The question-indicator map serves as a stable interface that decouples widgets from the underlying question structure.

**Note**: This is a fragile but essential part of the application. Changes to survey questions or widget indicators require careful updates to maintain consistency.

## Testing

There are several layers of testing in this project:

- API tests: The API application has unit tests and integration tests that can be run using the `pnpm api:test` command.
- Client tests: The client application has component tests that can be run using the `pnpm client:test` command.
- End-to-end tests:
  - There is an additional package in the repo called `e2e`. This package contains end-to-end tests that can be run using the `pnpm test` command. This command will take care of spinning up the API and Client applications
    before running the tests, and will take care of setting up and tearing down any preconditions for the tests, using the `E2ETestManager` class stored in the `shared` package.
  - Additionally, you can run e2e test using the UI mode by running `pnpm test:ui` command. This will open the Playwright UI where you can run the tests and see the results.
  - *NOTE*: To run the tests locally, an up and running database is required, with the specified connection parameters specified both for the API and the `E2ETestManager` class. 
            Due to current limitations of Playwright, a previous Typescript code transpilation is required before running the tests. Both running commands available in the `package.json` file will take care of this before running the tests.
  
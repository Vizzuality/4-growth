# OData Server

This folder contains an OData server built using the `odata-v4-server` package. This server is intended for development and testing purposes and simulates a real-life scenario where the project will consume data exposed through the OData protocol.

## Notes

This OData server is for development and testing purposes only and is not intended for production use.
The server simulates a real-life scenario where the project will consume data exposed through the OData protocol.

## Project Structure

- `src`: Contains the source code for the OData server.
- `package.json`: Contains the dependencies and scripts for the project.
- `tsconfig.json`: TypeScript configuration file.

## Installation

To install the dependencies, run the following command:

```sh
pnpm install
```

## Running the Server

To start the OData server, run the following commands:

Development / watch mode

```sh
pnpm start:dev
```

Production mode

```sh
pnpm start:prod
```

The server will be accessible at http://localhost:4001/odata.

(Pending to configure the server to use a different port)
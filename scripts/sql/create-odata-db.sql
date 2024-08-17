
-- This script creates a database in the local postgresql instance for the OData server which is used for development and testing purposes.
-- It expects to be created when you launch the odata server, and it automatically executed when you run the database from the docker-compose file.

CREATE DATABASE "4growth-odata" OWNER "4growth";

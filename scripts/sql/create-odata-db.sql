
-- This script creates a database in the local postgresql instance for the OData server which is used for development and testing purposes.
-- Since CREATE DATABASE is not allowed in functions or transaction block, we drop the database if exists to avoid errors. We will also add a script to populate
-- the database with the data.

DROP DATABASE IF EXISTS "4growth-odata";

CREATE DATABASE "4growth-odata" OWNER "4growth";

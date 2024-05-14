import {DataSource} from "typeorm";

export const datasource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    entities: [
        __dirname + "/../**/*.entity{.ts,.js}",
    ],
})
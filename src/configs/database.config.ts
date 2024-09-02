import { registerAs } from '@nestjs/config';

const {
    //DB_HOST = 'delivery.c7gk2uuwsdol.eu-north-1.rds.amazonaws.com',
    DB_HOST = 'localhost',
    DB_PORT = 5432,
    DB_USERNAME = 'postgres',
    DB_PASSWORD = 'root',
    //DB_NAME = 'delivery-project',
    DB_NAME = 'delivery',
} = process.env;

export default registerAs('database', () => ({
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    entities: [`${__dirname}/../database/entities/**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../database/migrations/**/*{.ts,.js}`],
    migrationsRun: true,
    cache: true,
    maxQueryExecutionTime: 500,
}));

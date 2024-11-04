import 'dotenv/config';
import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const portDBVolvo = process.env.DB_PORT_VOLVO as unknown as number;

const diretorioDataBase = path.resolve(__dirname, '..');

const options: DataSourceOptions = {
    type: 'mssql',
    host: process.env.DB_HOST_VOLVO,
    port: Number(portDBVolvo),
    username: process.env.DB_USER_VOLVO,
    password: process.env.DB_PASS_VOLVO,
    schema: process.env.DB_SCHEMA_VOLVO,
    database: process.env.DB_NAME_VOLVO,
    extra: {
        trustServerCertificate: true
    },
    entities: [`${diretorioDataBase}/**/entities/volvo/*.{ts,js}`]
};

export const AppDataSource2 = new DataSource(options);
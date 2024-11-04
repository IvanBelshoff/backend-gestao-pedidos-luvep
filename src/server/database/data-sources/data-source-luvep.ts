import 'dotenv/config';
import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const portDBLuvep = process.env.DB_PORT_LUVEP as unknown as number;

const diretorioDataBase = path.resolve(__dirname, '..');

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST_LUVEP,
    port: portDBLuvep,
    username: process.env.DB_USER_LUVEP,
    password: process.env.DB_PASS_LUVEP,
    database: process.env.DB_NAME_LUVEP,
    entities: [`${diretorioDataBase}/**/entities/luvep/*.{ts,js}`],
    migrations: [`${diretorioDataBase}/**/migrations/*.{ts,js}`]
};

export const AppDataSource1 = new DataSource(options);
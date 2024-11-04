import 'dotenv/config';
import cors from 'cors';
import 'reflect-metadata';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';

import './shared/services/TranslationsYup';
import { router } from './routes';
import path from 'path';

const server = express();

server.use(express.json());

server.disable('etag');
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use((req, res, next) => {

    server.use(cors());

    /*
    server.use(cors({
        origin:'https://.google.com'
    }));*/

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

server.use('/uploads/fotos/usuarios', express.static(path.resolve(__dirname, 'shared', 'data', 'fotos-usuarios')));

server.use(router);

export { server };
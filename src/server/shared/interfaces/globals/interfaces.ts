import multer, { StorageEngine } from "multer";
import { Request } from 'express';

export interface IParamsIdGlobal { id?: number }

export interface IJwtData { uid: number }

export interface IMulterConfigOptions {
    dest: string;
    storage: StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => void;
    limits: {
        fileSize: number;
    };
}

export type JwtPayload = {
    uid: string
    sub: string
}

export interface IPermissao {
    nome: string;
    nome_regra?: string;
}

export interface IRegra {
    nome: string;
    permissoes: IPermissao[];
}
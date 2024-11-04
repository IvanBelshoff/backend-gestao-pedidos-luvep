import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';
import { IMulterConfigOptions } from '../interfaces';


export const createMulterConfigFoto = (): IMulterConfigOptions => {

    const storage = multer.diskStorage({
        destination: (request, file, callback) => {
            callback(null, path.resolve(__dirname, '..', 'data', 'fotos-usuarios'));
        },
        filename(request, file, callback) {
            crypto.randomBytes(6, (err, hash) => {
                if (err) { callback(err, 'erro'); }

                const filename = `${hash.toString('hex')}-${file.originalname}`;
                callback(null, filename);
            });
        }
    });

    const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo inválido'));
        }
    };

    return {
        dest: path.resolve(__dirname, '..', 'data', 'fotos-usuarios'),
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 4 * 1024 * 1024
        }
    };
};



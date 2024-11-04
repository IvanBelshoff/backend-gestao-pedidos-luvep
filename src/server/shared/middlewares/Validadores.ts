import { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../../database/entities';
import { usuarioRepository } from '../../database/repositories';
import { StatusCodes } from 'http-status-codes';
import { JWTService } from '../services';
import multer from 'multer';
import { createMulterConfigFoto } from './MulterFoto';
import { JwtPayload } from '../interfaces';

export async function decoder(req: Request): Promise<Usuario | undefined> {

    const authorization = req.headers.authorization || '';

    const token = authorization.split(' ')[1];

    if (!token) {
        return undefined;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await usuarioRepository.findOne({
        relations: {
            regra: true,
            permissao: true
        },
        where: {
            id: Number(decode.uid)
        }
    });

    if (user == null) {
        return undefined;
    }

    return user;

}

const Regras = (regra: String[]) => {

    const regraAutorização: RequestHandler = async (req, res, next) => {

        const user = await decoder(req);

        const userRoles = user?.regra.map((regra) => regra.nome);

        const existeRegras = userRoles?.some((r) => regra.includes(String(r)));

        const isAdmin = user?.regra.some((regra) => regra.nome === 'REGRA_ADMIN');

        if (isAdmin) {
            return next();
        } else if (existeRegras) {
            return next();
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'Permissao não autorizada contate o administrador do sistema' }
        });
    };

    return regraAutorização;
};

const Permissoes = (permissao: String[]) => {

    const permissaoAutorizacao: RequestHandler = async (req, res, next) => {

        const user = await decoder(req);

        const isAdmin = user?.regra.some((regra) => regra.nome === 'REGRA_ADMIN');

        if (isAdmin) {
            return next();
        }

        const userPermissioes = user?.permissao.map((permissao) => permissao.nome);

        const existePermissoes = userPermissioes?.some((r) => permissao.includes(String(r)));

        if (existePermissoes) {
            return next();
        }

        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: { default: 'Permissao não autorizada contate o administrador do sistema' }
        });
    };

    return permissaoAutorizacao;
};


const EnsureAuthenticated: RequestHandler = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    const jwtData = JWTService.verify(token);

    if (jwtData === 'JWT_SECRET_NOT_FOUND') {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: 'Erro ao verificar o token' }
        });
    } else if (jwtData === 'INVALID_TOKEN') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: { default: 'Não autenticado' }
        });
    }

    req.headers.idUsuario = jwtData.uid.toString();

    return next();
};

const SalvarFoto = () => {

    const uploadMulter: RequestHandler = async (req, res, next) => {

        const upload = multer(createMulterConfigFoto()).single('foto');

        upload(req, res, async function (err) {

            if (err instanceof multer.MulterError) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { default: `Ocorreu um erro desconhecido durante o upload: ${err.message}` } });
            } else if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { default: `Ocorreu um erro durante o upload: ${err.message}` } });
            } else {
                next();
            }

        }

        );
    };

    return uploadMulter;
};

export { Regras, Permissoes, EnsureAuthenticated, SalvarFoto };
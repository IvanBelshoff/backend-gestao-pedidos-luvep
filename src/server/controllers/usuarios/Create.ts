import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { Localidade, TipoUsuario } from '../../database/entities';
import { decoder, validation } from '../../shared/middlewares';
import { IBodyCreateUsuarios, IResponseErros } from '../../shared/interfaces';
import { FotosProvider } from '../../models/fotos';
import { deleteArquivoLocal } from '../../shared/services';
import { UsuariosProvider } from '../../models/usuarios';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyCreateUsuarios>(yup.object().shape({
        nome: yup.string().required().min(1).max(50),
        sobrenome: yup.string().required().min(1).max(50),
        email: yup.string().required().email().min(5),
        codigo_vendedor: yup.string().optional().min(1).max(50),
        bloqueado: yup.boolean().required(),
        localidade: yup.string().required().oneOf(Object.values(Localidade), 'Inválida'),
        tipo_usuario: yup.string().required().oneOf(Object.values(TipoUsuario), 'Inválida'),
        senha: yup.string().required().min(6),
    }))
}));

export const create = async (req: Request<{}, {}, IBodyCreateUsuarios>, res: Response) => {

    const usuario = await decoder(req);

    const validaEmailEMatricula = await UsuariosProvider.validaEmailEMatriculaFuncionario(undefined, req.body.email);

    if (validaEmailEMatricula instanceof Error) {

        if (req.file) {
            const deleteFoto = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }
        }

        const response: IResponseErros = JSON.parse(validaEmailEMatricula.message);

        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(validaEmailEMatricula.message)
        });
    }

    if (req.file) {

        const resultFoto = await FotosProvider.create({
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            originalname: req.file.originalname,
            path: req.file.path,
            size: req.file.size
        });

        if (resultFoto instanceof Error) {
            const deleteFotolocal = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFotolocal instanceof Error) {
                console.log(deleteFotolocal.message);
            }

            const deleteFoto = await FotosProvider.deleteByFilename(req.file.filename);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultFoto.message
                }
            });
        }

        const resultUsuario = await UsuariosProvider.create({
            ...req.body,
            usuario_cadastrador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            usuario_atualizador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            id_foto: resultFoto,
        });

        if (resultUsuario instanceof Error) {

            const deleteFotoLocal = await deleteArquivoLocal(req.file.path, req.file.originalname);

            if (deleteFotoLocal instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: resultUsuario.message
                    }
                });
            }

            const deleteFoto = await FotosProvider.deleteByFilename(req.file.filename);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }

            if (deleteFoto instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: deleteFoto.message
                    }
                });
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultUsuario.message
                }
            });
        }

        return res.status(StatusCodes.CREATED).json(resultUsuario);

    } else {

        const resultFoto = await FotosProvider.createNoFile();

        if (resultFoto instanceof Error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultFoto.message
                }
            });
        }

        const resultUsuario = await UsuariosProvider.create({
            ...req.body,
            usuario_cadastrador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            usuario_atualizador: `${usuario?.nome} ${usuario?.sobrenome}` || 'desconhecido',
            id_foto: resultFoto,
        });

        if (resultUsuario instanceof Error) {

            const deleteFoto = await FotosProvider.deleteById(resultFoto);

            if (deleteFoto instanceof Error) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    errors: {
                        default: resultUsuario.message
                    }
                });
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: resultUsuario.message
                }
            });
        }

        return res.status(StatusCodes.CREATED).json(resultUsuario);

    }

};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

import { decoder, validation } from '../../shared/middlewares';
import { IBodyUpdateByIdUsuarios, IParamsIdGlobal, IResponseErros } from '../../shared/interfaces';
import { Localidade, TipoUsuario } from '../../database/entities';
import { UsuariosProvider } from '../../models/usuarios';
import { deleteArquivoLocal } from '../../shared/services';

export const updateByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyUpdateByIdUsuarios>(yup.object().shape({
        nome: yup.string().required().min(1).max(50),
        sobrenome: yup.string().required().min(1).max(50),
        email: yup.string().required().email().min(5),
        codigo_vendedor: yup.string().required().min(1).max(50),
        bloqueado: yup.boolean().required(),
        localidade: yup.string().required().oneOf(Object.values(Localidade), 'Inválida'),
        tipo_usuario: yup.string().required().oneOf(Object.values(TipoUsuario), 'Inválida'),
        senha: yup.string().optional()
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateById = async (req: Request<IParamsIdGlobal, {}, IBodyUpdateByIdUsuarios>, res: Response) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = await decoder(req as Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>);

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const validaEmailEMatricula = await UsuariosProvider.validaEmailEMatriculaFuncionario(req.params.id, req.body.email as string | undefined);

    if (validaEmailEMatricula instanceof Error) {

        if (req.file) {
            const deleteFoto = await deleteArquivoLocal(req.file.path, req.file.filename);

            if (deleteFoto instanceof Error) {
                console.log(deleteFoto.message);
            }
        }

        const response: IResponseErros = JSON.parse(validaEmailEMatricula.message);

        return res.status(response.status == 400 ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: JSON.parse(validaEmailEMatricula.message)
        });
    }

    const result = await UsuariosProvider.updateById(req.params.id, {
        ...req.body,
        usuario_atualizador: `${usuario?.nome} ${usuario?.sobrenome}`
    }, req.file && {
        local: req.file.path,
        nome: req.file.filename,
        originalname: req.file.originalname,
        tamanho: req.file.size,
        tipo: req.file.mimetype,
    });

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
};
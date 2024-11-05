import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { decoder, validation } from '../../shared/middlewares';
import { IBodyCreateById, IParamsIdGlobal } from '../../shared/interfaces';
import { JustificativasProvider } from '../../models/justificativas';
import { ParsedQs } from 'qs';

export const createByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyCreateById>(yup.object().shape({
        conteudo: yup.string().required().min(1).max(500),
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const createById = async (req: Request<IParamsIdGlobal, {}, IBodyCreateById>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = await decoder(req as Request<{}, {}, {}, ParsedQs, Record<string, any>>);

    if (!usuario) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O usuário precisa ser informado'
            }
        });
    }

    const result = await JustificativasProvider.createById(req.params.id, req.body.conteudo, usuario);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};
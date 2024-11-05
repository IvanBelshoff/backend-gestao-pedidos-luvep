import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { decoder, validation } from '../../shared/middlewares';
import { IBodyUpdateById, IParamsIdGlobal } from '../../shared/interfaces';
import { JustificativasProvider } from '../../models/justificativas';
import { ParsedQs } from 'qs';

export const updataByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyUpdateById>(yup.object().shape({
        conteudo: yup.string().required().min(1).max(500)
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateById = async (req: Request<IParamsIdGlobal, {}, IBodyUpdateById>, res: Response) => {

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

    const result = await JustificativasProvider.updateById(req.params.id, req.body, usuario);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();

};

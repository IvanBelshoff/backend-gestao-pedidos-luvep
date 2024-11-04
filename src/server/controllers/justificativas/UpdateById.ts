import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import {  IBodyUpdateById, IParamsIdGlobal } from '../../shared/interfaces';
import { JustificativasProvider } from '../../models/justificativas';

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

    const result = await JustificativasProvider.updateById(req.params.id, req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();

};

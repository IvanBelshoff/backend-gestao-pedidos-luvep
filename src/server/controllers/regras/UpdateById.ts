import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import {  IBodyUpdateRegras, IParamsIdGlobal } from '../../shared/interfaces';
import { RegrasProvider } from '../../models/regras';

export const updataByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodyUpdateRegras>(yup.object().shape({
        nome: yup.string().required().min(1).max(50),
        descricao: yup.string().required().min(1).max(50),
    }))
}));

export const updateById = async (req: Request<IParamsIdGlobal, {}, IBodyUpdateRegras>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await RegrasProvider.updateById(req.params.id, req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();

};

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import {  IBodychildren, IParamsIdGlobal } from '../../shared/interfaces';
import { UsuariosProvider } from '../../models/usuarios';

export const updateSubordinadosByIdValidation = validation((getSchema) => ({
    body: getSchema<IBodychildren>(yup.object().shape({
        children: yup.array().of(yup.number().integer().required().moreThan(0)).optional(),
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateSubordinadosById = async (req: Request<IParamsIdGlobal, {}, IBodychildren>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }
    
    const result = await UsuariosProvider.updateSubordinadosById(req.params.id, { children: req.body.children });

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
};

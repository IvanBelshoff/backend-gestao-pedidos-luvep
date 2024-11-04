import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { PermissoesProvider } from '../../models/permissoes';
import { IBodyCreatePermissoes } from '../../shared/interfaces';

export const createValidation = validation((getSchema) => ({
    body: getSchema<IBodyCreatePermissoes>(yup.object().shape({
        nome: yup.string().required().min(1).max(50),
        descricao: yup.string().required().min(1).max(50),
        regra_id: yup.number().integer().required().moreThan(0),
    }))
}));

export const create = async (req: Request<{}, {}, IBodyCreatePermissoes>, res: Response) => {
   
    const result = await PermissoesProvider.create(req.body);

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.CREATED).json(result);

};
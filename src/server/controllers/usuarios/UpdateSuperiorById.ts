import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { IBodySuperior, IParamsIdGlobal } from '../../shared/interfaces';
import { UsuariosProvider } from '../../models/usuarios';

export const updateSuperiorByIdIdValidation = validation((getSchema) => ({
    body: getSchema<IBodySuperior>(yup.object().shape({
        parent: yup.number().integer().optional()
    })),
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}));

export const updateSuperiorById = async (req: Request<IParamsIdGlobal, {}, IBodySuperior>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await UsuariosProvider.updateSuperiorById(req.params.id, { parent: req.body.parent });

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
};

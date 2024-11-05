import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { validation } from '../../shared/middlewares';
import { IParamsIdGlobal, IQueryGetchildrenById } from '../../shared/interfaces';
import { UsuariosProvider } from '../../models/usuarios';

export const getSubordinadosByIdValidation = validation((getSchema) => ({
    params: getSchema<IParamsIdGlobal>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    })),
    query: getSchema<IQueryGetchildrenById>(yup.object().shape({
        children: yup.string().optional(),
        childrenDisponiveis: yup.string().optional(),
    }))
}));

export const getSubordinadosById = async (req: Request<IParamsIdGlobal, {}, {}, IQueryGetchildrenById>, res: Response) => {

    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado'
            }
        });
    }

    const result = await UsuariosProvider.getSubordinadosById(
        req.params.id,
        req.query.children,
        req.query.childrenDisponiveis
    );

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        });
    }

    return res.status(StatusCodes.OK).json(result);
};

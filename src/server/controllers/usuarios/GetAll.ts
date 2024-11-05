import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { validation } from '../../shared/middlewares';
import { IQueryGetAll } from '../../shared/interfaces';
import { Localidade } from '../../database/entities';
import { UsuariosProvider } from '../../models/usuarios';

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryGetAll>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional(),
        vinculos: yup.string().oneOf(['superior', 'subordinados', 'nenhum'], 'Vínculo invalido').optional(),
        localidade: yup.string().optional().oneOf(Object.values(Localidade), 'Localidade invalida'),
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryGetAll>, res: Response) => {

    const result = await UsuariosProvider.getAll(
        req.query.page,
        req.query.limit,
        req.query.localidade,
        req.query.vinculos,
        req.query.filter
    );

    const count = await UsuariosProvider.count(
        req.query.localidade,
        req.query.vinculos,
        req.query.filter
    );

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        });
    } else if (count instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: count.message }
        });
    }

    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);

    return res.status(StatusCodes.OK).json(result);
};

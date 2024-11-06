import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';

import { decoder, validation } from '../../shared/middlewares';
import { IQueryGetAllPedidos } from '../../shared/interfaces';
import { PedidosProvider } from '../../models/pedidos';
import { ParsedQs } from 'qs';

export const getAllBySellerCodeValidation = validation((getSchema) => ({
    query: getSchema<IQueryGetAllPedidos>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional()
    }))
}));

export const getAllBySellerCode = async (req: Request<{}, {}, {}, IQueryGetAllPedidos>, res: Response) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = await decoder(req as Request<{}, {}, {}, ParsedQs, Record<string, any>>);

    if (!usuario) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O usuário precisa ser informado'
            }
        });
    }

    const result = await PedidosProvider.getAllBySellerCode(
        usuario.codigo_vendedor,
        req.query.page,
        req.query.limit,
        req.query.filter
    );

    const count = await PedidosProvider.countBySellerCode(
        usuario.codigo_vendedor,
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

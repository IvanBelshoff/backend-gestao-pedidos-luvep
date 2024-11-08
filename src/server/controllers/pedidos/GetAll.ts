import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { ParsedQs } from 'qs';

import { decoder, validation } from '../../shared/middlewares';
import { IQueryGetAllPedidos } from '../../shared/interfaces';
import { PedidosProvider } from '../../models/pedidos';
import { Pedido, TipoUsuario } from '../../database/entities';

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryGetAllPedidos>(yup.object().shape({
        page: yup.number().optional().moreThan(0),
        limit: yup.number().optional().moreThan(0),
        filter: yup.string().optional()
    }))
}));

export const getAll = async (req: Request<{}, {}, {}, IQueryGetAllPedidos>, res: Response) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usuario = await decoder(req as Request<{}, {}, {}, ParsedQs, Record<string, any>>);

    console.log(usuario);

    if (!usuario) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O usuário precisa ser informado'
            }
        });
    }

    let result: Error | Pedido[];
    let count: number | Error;

    if (usuario.tipo_usuario == TipoUsuario.CON) {

        const pedidos = await PedidosProvider.getAllConsultores(
            usuario.id,
            req.query.page,
            req.query.limit,
            req.query.filter
        );

        const pedidosCount = await PedidosProvider.countAllConsultores(
            usuario.id,
            req.query.filter
        );

        result = pedidos;
        count = pedidosCount;

    } else if (usuario.tipo_usuario == TipoUsuario.COOR) {

        const pedidos = await PedidosProvider.getAllCoordenadores(
            usuario.id,
            req.query.page,
            req.query.limit,
            req.query.filter
        );

        const pedidosCount = await PedidosProvider.countAllCoordenadores(
            usuario.id,
            req.query.filter
        );

        result = pedidos;
        count = pedidosCount;

    } else if (usuario.tipo_usuario == TipoUsuario.GER) {

        const pedidos = await PedidosProvider.getAllGerentes(
            usuario.id,
            req.query.page,
            req.query.limit,
            req.query.filter
        );

        const pedidosCount = await PedidosProvider.countAllGerentes(
            usuario.id,
            req.query.filter
        );

        result = pedidos;
        count = pedidosCount;

    } else {
        
        const pedidos = await PedidosProvider.getAll(
            req.query.page,
            req.query.limit,
            req.query.filter
        );

        const pedidosCount = await PedidosProvider.count(req.query.filter);

        result = pedidos;
        count = pedidosCount;
    }

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

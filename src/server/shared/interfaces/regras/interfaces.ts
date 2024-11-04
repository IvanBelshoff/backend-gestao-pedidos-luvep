import { Regra } from '../../../database/entities';


export interface IBodyCreateRegras extends Omit<Regra, 'id' | 'data_criacao' | 'data_atualizacao' | 'permissao' | 'usuario'> { }

export interface IQueryGetAllRegras{
    page?: number,
    limit?: number,
    filter?: string,
}

export interface IBodyUpdateRegras extends Omit<Regra, 'id' | 'data_criacao' | 'data_atualizacao' | 'permissao' | 'usuario'> { }

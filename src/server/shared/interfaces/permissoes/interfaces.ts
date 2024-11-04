import { Permissao } from "../../../database/entities";

export interface IBodyCreatePermissoes extends Omit<Permissao, 'id' | 'data_criacao' | 'data_atualizacao' | 'regra' | 'usuario'> { regra_id: number }

export interface IQueryGetAllPermissoes {
    page?: number,
    limit?: number,
    filter?: string,
}

export interface IBodyUpdatePermissoes extends Omit<Permissao, 'id' | 'data_criacao' | 'data_atualizacao' | 'regra' | 'usuario'> { regra_id?: number }

import { Usuario } from "../../../database/entities";

export interface IBodyCreateUsuarios extends Omit<Usuario, 'id' | 'data_criacao' | 'data_atualizacao' | 'regra' | 'permissao' | 'foto'> { id_copy_regras?: number }

export interface IQueryGetAllUsuarios {
    page?: number;
    limit?: number;
    filter?: string;
}

export interface IBodyLoginUsuarios extends Omit<Usuario, 'id' | 'nome' | 'data_criacao' | 'sobrenome' | 'regra' | 'permissao' | 'foto' | 'data_atualizacao' | 'bloqueado' | 'data_criacao' | 'dashboard' | 'localidade' | 'departamento' | 'secao'> { }

export interface IBodyRecoverPasswordUsuarios { emailRecuperacao: string }

export interface IQueryRecoverPasswordUsuarios {
    tipo?: 'capitalizado' | 'minusculo' | 'maiusculo';
    caracteres?: number;
    cumprimento?: number;
    tema?: 'aleatorios' | 'cidades' | 'paises' | 'tecnologias';
    numeros?: number;
}

export interface IBodyUpdateRolesAndPermissionsByIdUsuarios { regras?: number[], permissoes?: number[] }

export interface IBodyUpdateByIdUsuarios extends Omit<Usuario, 'id' | 'data_criacao' | 'data_atualizacao' | 'regra' | 'permissao' | 'foto'> { id_copy_regras?: number }

export interface IEmailValidaEmailUsuario {
    email?: string
}

export interface IBodyCopyRolesAndPermissionsByIdUsuarios {
    id_usuario: number
    id_copiado: number
}
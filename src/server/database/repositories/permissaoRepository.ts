import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Permissao } from '../entities';

export const permissaoRepository = AppDataSource1.getRepository(Permissao);
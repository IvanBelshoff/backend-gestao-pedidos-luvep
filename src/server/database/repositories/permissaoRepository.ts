import { AppDataSource } from '../data-source';
import { Permissao } from '../entities';

export const permissaoRepository = AppDataSource.getRepository(Permissao);
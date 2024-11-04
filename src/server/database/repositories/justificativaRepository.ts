import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Justificativa } from '../entities';

export const justificativaRepository = AppDataSource1.getRepository(Justificativa);
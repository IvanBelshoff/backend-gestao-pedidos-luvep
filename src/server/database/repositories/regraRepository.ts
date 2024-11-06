import { AppDataSource1 } from '../data-sources/data-source-luvep';
import { Regra } from '../entities';

export const regraRepository = AppDataSource1.getRepository(Regra);
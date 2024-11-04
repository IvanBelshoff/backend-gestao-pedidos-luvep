import { AppDataSource } from '../data-source';
import { Regra } from '../entities';

export const regraRepository = AppDataSource.getRepository(Regra);
import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { MeEntity } from './MeEntity';

export interface MeRepository {
  me(): Promise<Either<IFailure, MeEntity>>;
}

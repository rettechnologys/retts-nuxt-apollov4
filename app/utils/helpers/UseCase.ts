import type { IFailure } from '@/utils/types/Failure';
import type { Either } from './Either';

export abstract class UseCase<T, P> {
  abstract call(p: P): Promise<Either<IFailure, T>>;
}

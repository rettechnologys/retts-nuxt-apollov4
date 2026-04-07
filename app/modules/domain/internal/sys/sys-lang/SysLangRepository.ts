import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { CUSysLangReqBody, SysLangEntity } from './SysLangEntity';

export interface SysLangRepository {
  removeOnes(id: string): Promise<Either<IFailure, SysLangEntity>>;
  findManys(): Promise<Either<IFailure, SysLangEntity[]>>;
  findOnes(id: string): Promise<Either<IFailure, SysLangEntity>>;
  recoverOnes(id: string): Promise<Either<IFailure, SysLangEntity>>;
  createUpdateOnes(
    reqBody: CUSysLangReqBody,
  ): Promise<Either<IFailure, SysLangEntity>>;
}

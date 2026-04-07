import { Either } from '@retts-packages/utilities-helper';
import { IFailure } from '@/utils/types/Failure';
import { GlobalConfigEntity } from './GlobalConfigEntity';
import { GlobalHealthEntity } from './GlobalHealthEntity';
import { RequestParams } from '@/modules/data/internal/data-source/http-client';

export interface GlobalRepository {
  configs(): Promise<Either<IFailure, GlobalConfigEntity>>;
  healths(): Promise<Either<IFailure, GlobalHealthEntity>>;
  downloadFile(
    path: string,
    axiosConfig?: RequestParams,
  ): Promise<Either<IFailure, Blob>>;
}

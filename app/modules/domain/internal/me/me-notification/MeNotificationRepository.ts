import { Either } from '~/utils/helpers/Either';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import {
  IDataPaginationResponse,
  INonDataResponse,
} from '@/utils/types/ResponseInternal';
import { MeNotificationEntity } from '../MeEntity';

export interface MeNotificationRepository {
  findManys(
    query?: IReqQuery,
  ): Promise<Either<IFailure, IDataPaginationResponse<MeNotificationEntity[]>>>;
  findOnes(
    uuid: string,
    query?: IReqQuery,
  ): Promise<Either<IFailure, MeNotificationEntity>>;
  read(headerId: number): Promise<Either<IFailure, INonDataResponse>>;
}

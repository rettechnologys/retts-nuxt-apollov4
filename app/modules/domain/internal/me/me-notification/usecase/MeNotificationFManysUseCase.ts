import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqQuery } from '@/utils/types/RequestInternal';
import { IDataPaginationResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';

import type { MeNotificationRepository } from '../MeNotificationRepository';
import { MeNotificationEntity } from '../../MeEntity';

@singleton()
export class MeNotificationFManysUseCase
  implements
    UseCase<IDataPaginationResponse<MeNotificationEntity[]>, IReqQuery>
{
  private MeNotificationRepository: MeNotificationRepository;

  constructor(
    @inject('MeNotificationRepository')
    MeNotificationRepository: MeNotificationRepository,
  ) {
    this.MeNotificationRepository = MeNotificationRepository;
  }

  call(
    query?: IReqQuery,
  ): Promise<
    Either<IFailure, IDataPaginationResponse<MeNotificationEntity[]>>
  > {
    return this.MeNotificationRepository.findManys(query);
  }
}

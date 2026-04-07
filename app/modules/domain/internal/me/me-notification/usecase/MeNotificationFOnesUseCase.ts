import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import type { MeNotificationRepository } from '../MeNotificationRepository';
import { MeNotificationEntity } from '../../MeEntity';

@singleton()
export class MeNotificationFOnesUseCase
  implements UseCase<MeNotificationEntity, IReqUidQuery>
{
  private MeNotificationRepository: MeNotificationRepository;

  constructor(
    @inject('MeNotificationRepository')
    MeNotificationRepository: MeNotificationRepository,
  ) {
    this.MeNotificationRepository = MeNotificationRepository;
  }

  call(
    reqUidQuery: IReqUidQuery,
  ): Promise<Either<IFailure, MeNotificationEntity>> {
    return this.MeNotificationRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}

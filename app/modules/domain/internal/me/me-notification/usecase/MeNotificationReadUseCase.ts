import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidBody } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import type { MeNotificationRepository } from '../MeNotificationRepository';
import { MeNotificationEntity } from '../../MeEntity';
import { INonDataResponse } from '@/utils/types/ResponseInternal';

@singleton()
export class MeNotificationReadUseCase
  implements UseCase<INonDataResponse, number>
{
  private MeNotificationRepository: MeNotificationRepository;

  constructor(
    @inject('MeNotificationRepository')
    MeNotificationRepository: MeNotificationRepository,
  ) {
    this.MeNotificationRepository = MeNotificationRepository;
  }

  call(headerId: number): Promise<Either<IFailure, INonDataResponse>> {
    return this.MeNotificationRepository.read(headerId);
  }
}

import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import { DManySysNotifManualReqBody } from '../SysNotifManualEntity';
import type { SysNotifManualRepository } from '../SysNotifManualRepository';

@singleton()
export class SysNotifManualRemManysUseCase
  implements UseCase<INonDataResponse, DManySysNotifManualReqBody>
{
  private sysNotifManualRepository: SysNotifManualRepository;

  constructor(
    @inject('SysNotifManualRepository')
    sysNotifManualRepository: SysNotifManualRepository,
  ) {
    this.sysNotifManualRepository = sysNotifManualRepository;
  }

  call(
    reqBody: DManySysNotifManualReqBody,
  ): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysNotifManualRepository.removeManys(reqBody);
  }
}

import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { SysNotifManualRepository } from '../SysNotifManualRepository';

@singleton()
export class SysNotifManualRemOnesUseCase
  implements UseCase<INonDataResponse, string>
{
  private sysNotifManualRepository: SysNotifManualRepository;

  constructor(
    @inject('SysNotifManualRepository')
    sysNotifManualRepository: SysNotifManualRepository,
  ) {
    this.sysNotifManualRepository = sysNotifManualRepository;
  }

  call(uuid: string): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysNotifManualRepository.removeOnes(uuid);
  }
}

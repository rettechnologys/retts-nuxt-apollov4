import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysNotifManualEntity } from '../SysNotifManualEntity';
import type { SysNotifManualRepository } from '../SysNotifManualRepository';

@singleton()
export class SysNotifManualFOnesUseCase
  implements UseCase<SysNotifManualEntity, IReqUidQuery>
{
  private sysNotifManualRepository: SysNotifManualRepository;

  constructor(
    @inject('SysNotifManualRepository')
    sysNotifManualRepository: SysNotifManualRepository,
  ) {
    this.sysNotifManualRepository = sysNotifManualRepository;
  }

  call(
    reqUidQuery: IReqUidQuery,
  ): Promise<Either<IFailure, SysNotifManualEntity>> {
    return this.sysNotifManualRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}

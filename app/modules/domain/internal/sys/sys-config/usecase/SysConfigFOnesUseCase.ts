import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { IReqUidQuery } from '@/utils/types/RequestInternal';
import { inject, singleton } from 'tsyringe';
import { SysConfigEntity } from '../SysConfigEntity';
import type { SysConfigRepository } from '../SysConfigRepository';

@singleton()
export class SysConfigFOnesUseCase
  implements UseCase<SysConfigEntity, IReqUidQuery>
{
  private sysConfigRepository: SysConfigRepository;

  constructor(
    @inject('SysConfigRepository') sysConfigRepository: SysConfigRepository,
  ) {
    this.sysConfigRepository = sysConfigRepository;
  }

  call(reqUidQuery: IReqUidQuery): Promise<Either<IFailure, SysConfigEntity>> {
    return this.sysConfigRepository.findOnes(
      reqUidQuery.uid.toString(),
      reqUidQuery.query,
    );
  }
}

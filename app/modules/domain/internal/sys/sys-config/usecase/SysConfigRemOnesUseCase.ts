import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { SysConfigRepository } from '../SysConfigRepository';

@singleton()
export class SysConfigRemOnesUseCase
  implements UseCase<INonDataResponse, string>
{
  private sysConfigRepository: SysConfigRepository;

  constructor(
    @inject('SysConfigRepository') sysConfigRepository: SysConfigRepository,
  ) {
    this.sysConfigRepository = sysConfigRepository;
  }

  call(keyword: string): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysConfigRepository.removeOnes(keyword);
  }
}

import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INonDataResponse } from '@/utils/types/ResponseInternal';
import { inject, singleton } from 'tsyringe';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuRemOnesUseCase
  implements UseCase<INonDataResponse, string>
{
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(uuid: string): Promise<Either<IFailure, INonDataResponse>> {
    return this.sysMenuRepository.removeOnes(uuid);
  }
}

import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { INoParam } from '@/utils/types/NoParam';
import { inject, singleton } from 'tsyringe';
import { SysMenuEntity } from '../SysMenuEntity';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuFManysUseCase
  implements UseCase<SysMenuEntity[], INoParam>
{
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(): Promise<Either<IFailure, SysMenuEntity[]>> {
    return this.sysMenuRepository.findManys();
  }
}

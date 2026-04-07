import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysMenuAclActionsEntity } from '../SysMenuAclEntity';
import type { SysMenuAclRepository } from '../SysMenuAclRepository';
import { ISysMenuAclParam } from '../SysMenuAclParam';

@singleton()
export class SysMenuAclFManysActionsUseCase
  implements UseCase<SysMenuAclActionsEntity[], ISysMenuAclParam>
{
  private sysMenuAclRepository: SysMenuAclRepository;

  constructor(
    @inject('SysMenuAclRepository') sysMenuAclRepository: SysMenuAclRepository,
  ) {
    this.sysMenuAclRepository = sysMenuAclRepository;
  }

  call(
    param: ISysMenuAclParam,
  ): Promise<Either<IFailure, SysMenuAclActionsEntity[]>> {
    return this.sysMenuAclRepository.findManysActions(
      param.sysGroupId,
      param.sysMenuId,
    );
  }
}

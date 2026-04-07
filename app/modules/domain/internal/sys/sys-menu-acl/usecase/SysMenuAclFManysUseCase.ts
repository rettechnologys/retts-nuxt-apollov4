import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysMenuAclEntity } from '../SysMenuAclEntity';
import type { SysMenuAclRepository } from '../SysMenuAclRepository';

@singleton()
export class SysMenuAclFManysUseCase
  implements UseCase<SysMenuAclEntity[], number>
{
  private sysMenuAclRepository: SysMenuAclRepository;

  constructor(
    @inject('SysMenuAclRepository') sysMenuAclRepository: SysMenuAclRepository,
  ) {
    this.sysMenuAclRepository = sysMenuAclRepository;
  }

  call(sysGroupId: number): Promise<Either<IFailure, SysMenuAclEntity[]>> {
    return this.sysMenuAclRepository.findManys(sysGroupId);
  }
}

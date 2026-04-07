import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysMenuAclSimpleEntity } from '../SysMenuAclEntity';
import type { SysMenuAclRepository } from '../SysMenuAclRepository';
import { ISysMenuAclParamReqBody } from '../SysMenuAclParam';

@singleton()
export class SysMenuAclUOnesUseCase
  implements UseCase<SysMenuAclSimpleEntity, ISysMenuAclParamReqBody>
{
  private sysMenuAclRepository: SysMenuAclRepository;

  constructor(
    @inject('SysMenuAclRepository') sysMenuAclRepository: SysMenuAclRepository,
  ) {
    this.sysMenuAclRepository = sysMenuAclRepository;
  }

  call(
    param: ISysMenuAclParamReqBody,
  ): Promise<Either<IFailure, SysMenuAclSimpleEntity>> {
    return this.sysMenuAclRepository.updateOnes(
      param.sysGroupId,
      param.sysMenuId,
      param.reqBody,
    );
  }
}

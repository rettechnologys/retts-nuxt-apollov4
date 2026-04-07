import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { SysMenuEntity, URManySysMenuReqBody } from '../SysMenuEntity';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuRepManysUseCase
  implements UseCase<SysMenuEntity[], URManySysMenuReqBody>
{
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(
    reqBody: URManySysMenuReqBody,
  ): Promise<Either<IFailure, SysMenuEntity[]>> {
    return this.sysMenuRepository.replaceManys(reqBody);
  }
}

import { Either } from '~/utils/helpers/Either';
import { UseCase } from '~/utils/helpers/UseCase';
import { IFailure } from '@/utils/types/Failure';
import { inject, singleton } from 'tsyringe';
import { CSysMenuReqBody, SysMenuEntity } from '../SysMenuEntity';
import type { SysMenuRepository } from '../SysMenuRepository';

@singleton()
export class SysMenuCOnesUseCase
  implements UseCase<SysMenuEntity, CSysMenuReqBody>
{
  private sysMenuRepository: SysMenuRepository;

  constructor(
    @inject('SysMenuRepository') sysMenuRepository: SysMenuRepository,
  ) {
    this.sysMenuRepository = sysMenuRepository;
  }

  call(reqBody: CSysMenuReqBody): Promise<Either<IFailure, SysMenuEntity>> {
    return this.sysMenuRepository.createOnes(reqBody);
  }
}
